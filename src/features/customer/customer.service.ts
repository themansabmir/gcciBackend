import { Types } from "mongoose";
import { Logger } from "@lib/logger";
import JwtService from "@lib/jwt";
import { mailer } from "@lib/mail";
import BcryptService from "@lib/bcrypt";
import { renderTemplate } from "@lib/pugRenderer";
import { CustomerRepository } from "./customer.repository";
import { SignupBody, LoginBody, ForgotPasswordBody, InviteCustomerBody, ResetPasswordBody } from "./customer.dto";
import OrganizationRepository from "../organization/organization.repository";

export default class CustomerService {
  private customerRepository: CustomerRepository;
  private organizationRepository: OrganizationRepository;
  private jwtService: JwtService;
  private bcryptService: BcryptService;

  constructor(
    customerRepository: CustomerRepository, 
    organizationRepository: OrganizationRepository,
    jwtService: JwtService, 
    bcryptService: BcryptService
  ) {
    this.customerRepository = customerRepository;
    this.organizationRepository = organizationRepository;
    this.jwtService = jwtService;
    this.bcryptService = bcryptService;
  }

  /**
   * Signup - Create organization and admin customer
   */
  public async signup(body: SignupBody) {
    try {
      // Check if customer already exists
      const existingCustomer = await this.customerRepository.findOne({ email: body.email }).exec();
      if (existingCustomer) {
        throw new Error('Email already exists');
      }

      // Create organization
      const organization = await this.organizationRepository.create({
        name: body.organizationName,
        city: body.city,
        address: body.address,
        state: body.state,
        country: body.country,
        pin_code: body.pin_code,
        mobile_number: body.mobile_number,
        gst_number: body.gst_number,
        pan_number: body.pan_number,
        isApproved: false,
        is_active: false,
      });

      // Hash password
      const hashedPassword = await this.bcryptService.hash(body.password);

      // Create admin customer
      const customer = await this.customerRepository.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'admin',
        organizationId: organization._id as any,
        status: 'active',
        isVerified: false,
      });

      Logger.info(`Signup successful for ${customer.email}`);
      return { 
        message: 'Signup successful. Please wait for admin approval.',
        organizationId: organization._id,
        customerId: customer._id,
      };
    } catch (error: any) {
      Logger.error('Error in signup service', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Login - Authenticate customer
   */
  public async login(body: LoginBody) {
    try {
      const customer = await this.customerRepository.findOne({ email: body.email }).exec();
      if (!customer) {
        throw new Error('Invalid credentials');
      }

      const isValid = await this.bcryptService.compare(body.password, customer.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      if (customer.status !== 'active') {
        throw new Error('Account not active. Please complete your invitation.');
      }

      // Check organization status
      const organization = await this.organizationRepository.findById(String(customer.organizationId));
      if (!organization || !organization.is_active) {
        throw new Error('Organization not approved yet');
      }

      const token = await this.jwtService.generateToken({ 
        id: customer._id,
        email: customer.email,
        role: customer.role,
        organizationId: customer.organizationId,
      });

      Logger.info(`Login successful for ${customer.email}`);
      return { 
        message: 'Login successful', 
        token,
        customer: {
          id: customer._id,
          email: customer.email,
          name: customer.name,
          role: customer.role,
          organizationId: customer.organizationId,
        }
      };
    } catch (error: any) {
      Logger.error('Error in login service', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Forgot Password - Send reset password link
   */
  public async forgotPassword(body: ForgotPasswordBody) {
    try {
      const customer = await this.customerRepository.findOne({ email: body.email }).exec();
      if (!customer) {
        throw new Error('Customer not found');
      }

      const resetToken = await this.jwtService.generateToken(
        { id: customer._id, email: customer.email }, 
        { expiresIn: '15m' }
      );
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const html = renderTemplate('forgotPassword', { 
        name: customer.name || customer.email, 
        resetLink 
      });

      await mailer.sendMail({
        to: customer.email,
        subject: 'Password Reset Request',
        html,
      });

      Logger.info(`Password reset link sent to ${customer.email}`);
      return { message: 'Password reset link sent successfully' };
    } catch (error: any) {
      Logger.error('Error in forgotPassword service', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Invite a customer to join the organization
   */
  public async inviteCustomer(body: InviteCustomerBody, organizationId: string) {
    try {
      if (!Types.ObjectId.isValid(organizationId)) {
        throw new Error("Invalid organization ID");
      }

      const existingCustomer = await this.customerRepository.findOne({ email: body.email }).exec();
      if (existingCustomer) {
        throw new Error("Customer already exists");
      }

      // Generate random temp password and hash it
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await this.bcryptService.hash(randomPassword);

      // Generate invite token
      const token = await this.jwtService.generateToken({ email: body.email, organizationId }, { expiresIn: '7d' });
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const newCustomer = await this.customerRepository.create({
        email: body.email,
        password: hashedPassword,
        role: body.role || 'customer',
        organizationId: new Types.ObjectId(organizationId),
        status: "invited",
        isVerified: false,
        inviteToken: token,
        inviteExpiresAt: expiresAt,
      });

      const invitationLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const html = renderTemplate('inviteCustomer', { 
        email: body.email, 
        invitationLink,
        temporaryPassword: randomPassword
      });

      await mailer.sendMail({
        to: body.email,
        subject: "You are invited to join our organization",
        html,
      });

      Logger.info("Customer invitation created", { email: body.email, organizationId });
      return {
        id: newCustomer._id,
        email: newCustomer.email,
        status: newCustomer.status
      };
    } catch (error: any) {
      Logger.error('Error in inviteCustomer service', {
        message: error.message,
        stack: error.stack,
        email: body.email,
        organizationId,
      });
      throw error;
    }
  }

  /**
   * Reset password for invited customer
   */
  public async resetPassword(body: ResetPasswordBody) {
    try {
      const decoded = await this.jwtService.verify(body.token);
      const customer = await this.customerRepository.findOne({ email: decoded.email }).exec();
      
      if (!customer) {
        throw new Error('Invalid or expired token');
      }

      if (customer.inviteToken !== body.token) {
        throw new Error('Invalid token');
      }

      if (customer.inviteExpiresAt && customer.inviteExpiresAt < new Date()) {
        throw new Error('Token has expired');
      }

      const hashedPassword = await this.bcryptService.hash(body.newPassword);
      
      await this.customerRepository.updateById(String(customer._id), {
        password: hashedPassword,
        status: 'active',
        isVerified: true,
        inviteToken: undefined,
        inviteExpiresAt: undefined,
      }).exec();

      Logger.info(`Password reset for customer ${customer.email}`);
      return { message: 'Password reset successful. You can now login.' };
    } catch (error: any) {
      Logger.error('Error in resetPassword service', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
