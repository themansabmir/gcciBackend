import { Types } from 'mongoose';
import { Logger } from '@lib/logger';
import JwtService from '@lib/jwt';
import { mailer } from '@lib/mail';
import BcryptService from '@lib/bcrypt';
import { renderTemplate } from '@lib/pugRenderer';
import { CustomerRepository } from './customer.repository';
import { SignupBody, LoginBody, ForgotPasswordBody, InviteCustomerBody, ResetPasswordBody, ConfirmAccountBody } from './customer.dto';
import OrganizationRepository from '../organization/organization.repository';
import { VendorRepository } from '../vendor/vendor.repository';

export default class CustomerService {
  private customerRepository: CustomerRepository;
  private organizationRepository: OrganizationRepository;
  private vendorRepository: VendorRepository;
  private jwtService: JwtService;
  private bcryptService: BcryptService;

  constructor(
    customerRepository: CustomerRepository,
    organizationRepository: OrganizationRepository,
    vendorRepository: VendorRepository,
    jwtService: JwtService,
    bcryptService: BcryptService
  ) {
    this.customerRepository = customerRepository;
    this.organizationRepository = organizationRepository;
    this.vendorRepository = vendorRepository;
    this.jwtService = jwtService;
    this.bcryptService = bcryptService;
  }

  /**
   * Signup - Create organization and admin customer with vendor checking
   */
  public async signup(body: SignupBody) {
    try {
      Logger.info('Signup initiated', {
        email: body.email,
        organizationName: body.organizationName,
        pan_number: body.pan_number,
      });

      // Check if customer already exists
      const existingCustomer = await this.customerRepository.findOne({ email: body.email }).exec();
      if (existingCustomer) {
        Logger.info('Signup blocked: customer already exists', {
          email: body.email,
        });
        throw new Error('Email already exists');
      }

      // Check if vendor exists with this PAN number
      const existingVendor = await this.vendorRepository.findOne({ pan_number: body.pan_number }).exec();

      Logger.info('Vendor lookup completed for signup', {
        pan_number: body.pan_number,
        vendorFound: !!existingVendor,
      });

      let vendorId: Types.ObjectId | undefined;

      if (existingVendor) {
        // Vendor exists - use existing vendor reference
        vendorId = existingVendor._id as Types.ObjectId;
        Logger.info(`Vendor already exists with PAN: ${body.pan_number}, linking to organization`);
      } else {
        // Vendor doesn't exist - create new vendor
        Logger.info('Creating new vendor for signup', {
          pan_number: body.pan_number,
          organizationName: body.organizationName,
        });
        const newVendor = await this.vendorRepository.create({
          vendor_name: body.organizationName,
          vendor_type: ['shipper'] as any, // Default type for customer signups
          credit_days: '15', // Default value
          pan_number: body.pan_number,
          locations: [
            {
              city: body.city,
              address: body.address,
              state: body.state,
              country: body.country,
              pin_code: body.pin_code,
              telephone: '', // Optional, can be added to signup form
              mobile_number: body.mobile_number,
              fax: '', // Optional
              gst_number: body.gst_number,
              pan_number: body.pan_number,
            },
          ],
        });
        vendorId = newVendor._id as Types.ObjectId;
        Logger.info(`New vendor created with PAN: ${body.pan_number}`);
      }

      // Create organization with vendor reference
      Logger.info('Creating organization for signup', {
        organizationName: body.organizationName,
        pan_number: body.pan_number,
        vendorId,
      });
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
        vendorRef: vendorId,
        isApproved: false,
        is_active: true,
      });

      Logger.info('Organization created for signup', {
        organizationId: organization._id,
        email: body.email,
      });

      // Hash password
      Logger.info('Hashing password for new customer signup', {
        email: body.email,
      });
      const hashedPassword = await this.bcryptService.hash(body.password);

      // Create admin customer
      Logger.info('Creating admin customer for signup', {
        email: body.email,
        organizationId: organization._id,
      });
      const customer = await this.customerRepository.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'admin',
        organizationId: organization._id as any,
        status: 'active',
        isVerified: false,
      });

      Logger.info('Admin customer created for signup', {
        customerId: customer._id,
        email: customer.email,
        organizationId: organization._id,
      });

      // Generate confirmation token (valid for 7 days)
      const confirmToken = await this.jwtService.generateToken({ id: customer._id, email: customer.email }, { expiresIn: '7d' });
      const confirmLink = `${process.env.FRONTEND_URL}/confirm-account?token=${confirmToken}`;

      Logger.info('Confirmation token generated for signup', {
        customerId: customer._id,
        email: customer.email,
      });

      // Send confirmation email
      const html = renderTemplate('confirmAccount', {
        name: customer.name || customer.email,
        confirmLink,
      });

      await mailer.sendMail({
        to: customer.email,
        subject: 'Confirm Your Account',
        html,
      });

      Logger.info(`Signup successful for ${customer.email}, organization: ${organization._id}, vendor: ${vendorId}`);
      return {
        message: 'Signup successful. Please check your email to confirm your account.',
        organizationId: organization._id,
        customerId: customer._id,
        vendorId: vendorId,
        vendorExists: !!existingVendor,
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
        is_active: customer.status === 'active',
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
        },
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

      const resetToken = await this.jwtService.generateToken({ id: customer._id, email: customer.email }, { expiresIn: '15m' });
      Logger.info(`Reset token generated for ${customer.email}, token: ${resetToken}`);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const html = renderTemplate('forgotPassword', {
        name: customer.name || customer.email,
        resetLink,
      });

      await mailer.sendMail({
        to: customer.email,
        subject: 'Password Reset Request',
        html,
      });

      Logger.info(`Password reset link sent to ${customer.email}`);
      return { message: 'Password reset link sent successfully', resetToken };
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
        throw new Error('Invalid organization ID');
      }

      const existingCustomer = await this.customerRepository.findOne({ email: body.email }).exec();
      if (existingCustomer) {
        throw new Error('Customer already exists');
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
        status: 'invited',
        isVerified: false,
        inviteToken: token,
        inviteExpiresAt: expiresAt,
      });

      // Get organization name for email
      const organization = await this.organizationRepository.findById(organizationId);
      if (!organization) {
        throw new Error('Organization not found');
      }

      const invitationLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const html = renderTemplate('inviteEmail', {
        email: body.email,
        invitationLink,
        temporaryPassword: randomPassword,
        organizationName: organization.name,
      });

      await mailer.sendMail({
        to: body.email,
        subject: 'You are invited to join our organization',
        html,
      });

      Logger.info('Customer invitation created', { email: body.email, organizationId });
      return {
        id: newCustomer._id,
        email: newCustomer.email,
        status: newCustomer.status,
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

      if (!decoded || !decoded.email) {
        throw new Error('Invalid or expired token');
      }

      const customer = await this.customerRepository.findOne({ email: decoded.email }).exec();

      if (!customer) {
        throw new Error('Invalid or expired token');
      }

      Logger.info(`Decoded customer ${customer._id}`);

      const hashedPassword = await this.bcryptService.hash(body.newPassword);

      const updatePayload: any = {
        password: hashedPassword,
      };

      if (customer.status === 'invited') {
        updatePayload.status = 'active';
        updatePayload.isVerified = true;
        updatePayload.inviteToken = undefined;
        updatePayload.inviteExpiresAt = undefined;
      }

      await this.customerRepository.updateById(String(customer._id), updatePayload).exec();

      Logger.info(`Password reset for customer ${customer.email}`);
      return { message: 'Password reset successful. You can now login.' };
    } catch (error: any) {
      Logger.error('Error in resetPassword service', {
        message: error.message,
        stack: error.stack,
        error,
      });
      throw error;
    }
  }

  /**
   * Confirm customer account via email link
   */
  public async confirmAccount(body: ConfirmAccountBody) {
    try {
      // Verify token
      const decoded = await this.jwtService.verify(body.token);
      if (!decoded || !decoded.email) {
        throw new Error('Invalid or expired token');
      }

      const customer = await this.customerRepository.findOne({ email: decoded.email }).exec();

      console.log(decoded);

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Check if already verified
      if (customer.isVerified) {
        return { message: 'Account already confirmed. You can login now.' };
      }
      const hashedPassword = await this.bcryptService.hash(body.newPassword);

      // Update customer to verified
      await this.customerRepository
        .updateById(String(customer._id), {
          isVerified: true,
          password: hashedPassword,
          status: 'active',
        })
        .exec();

      Logger.info(`Account confirmed for customer ${customer.email}`);
      return { message: 'Account confirmed successfully. You can now login.' };
    } catch (error: any) {
      Logger.error('Error in confirmAccount service', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getCustomerProfile(customerId: string) {
    try {
      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const { ...customerProfile } = customer.toObject();
      return customerProfile;
    } catch (error) {
      Logger.error('Error fetching customer profile:', error);
      throw error;
    }
  }

  async updateCustomerProfile(customerId: string, updateData: { name?: string }) {
    try {
      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Only allow updating specific fields
      const allowedUpdates: { name?: string } = {};
      if (updateData.name !== undefined) {
        allowedUpdates.name = updateData.name;
      }

      const updatedCustomer = await this.customerRepository.updateById(customerId, allowedUpdates);

      if (!updatedCustomer) {
        throw new Error('Failed to update customer profile');
      }

      // Return updated customer without sensitive data
      const { ...customerProfile } = updatedCustomer.toObject();
      return customerProfile;
    } catch (error) {
      Logger.error('Error updating customer profile:', error);
      throw error;
    }
  }
}
