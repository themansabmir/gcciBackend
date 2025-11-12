import OrganizationRepository from './organization.repository';
import { VendorEntity, IVendor } from 'features/vendor/vendor.entity';
import { SignUpBody, LoginBody, ForgotPasswordBody, ResetPasswordBody, ConfirmAccountBody } from './organization.dto';
import BcryptService from '@lib/bcrypt';
import JwtService from '@lib/jwt';
import { mailer } from '@lib/mail';
import { Logger } from '@lib/logger';
import { Types } from 'mongoose';
import { renderTemplate } from '@lib/pugRenderer';
import UserService from 'features/user/user.service';

export default class OrganizationService {
  private organizationRepository: OrganizationRepository;
  private bcryptService: BcryptService;
  private jwtService: JwtService;
  private userService: UserService;

  constructor(
    organizationRepository: OrganizationRepository,
    bcryptService: BcryptService,
    jwtService: JwtService,
    userService: UserService
  ) {
    this.organizationRepository = organizationRepository;
    this.bcryptService = bcryptService;
    this.jwtService = jwtService;
    this.userService = userService;
  }

  // Signup
  async signup(body: SignUpBody) {
    const existingOrg = await this.organizationRepository.findOne({ email: body.email });
    if (existingOrg) throw new Error('Email already exists');

    let vendor: IVendor | null = await VendorEntity.findOne({ 'locations.pan_number': body.pan });

    if (!vendor) {
      vendor = await VendorEntity.create({
        vendor_name: body.organization_name ?? `${body.name}'s Organization`,
        vendor_type: ['consignee'],
        credit_days: body.credit_days ?? '15',
        locations: [
          {
            city: body.city,
            address: body.address,
            state: body.state,
            country: body.country,
            pin_code: body.pin_code,
            telephone: body.telephone,
            mobile_number: body.phone,
            fax: body.fax,
            gst_number: body.gst_number,
            pan_number: body.pan,
          },
        ],
        is_verified: false,
      });
    }

    const user = await this.userService.create({
      name: body.name,
      email: body.email,
      password: body.password,
      role: 'admin',
    });

    const newOrg = await this.organizationRepository.create({
      organization_name: body.organization_name,
      email: body.email,
      vendorRef: vendor._id as Types.ObjectId, // ✅ cast to ObjectId
      userRef: user._id as Types.ObjectId,     // also cast user._id
    });

    const confirmToken = await this.jwtService.generateToken({ id: user._id }, { expiresIn: '21d' });
    const confirmLink = `${process.env.FRONTEND_URL}/confirm-account?token=${confirmToken}`;
    const html = renderTemplate('confirmAccount', { name: user.name, confirmLink });

    await mailer.sendMail({
      to: user.email,
      subject: 'Confirm Your Account',
      html,
    });

    Logger.info(`Signup successful for ${user.email}`);
    return { message: 'Signup successful. Please check your email to confirm your account.' };
  }

  // Login
  async login(body: LoginBody) {
    const org = await this.organizationRepository.findOne({ email: body.email });
    if (!org) throw new Error('Invalid credentials');

    const user = await this.userService.findByEmail(body.email);
    if (!user) throw new Error('Invalid credentials');

    const isValid = await this.bcryptService.compare(body.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    if (!org.is_active) throw new Error('Account not confirmed');

    const token = await this.jwtService.generateToken({ id: user._id });
    return { message: 'Login successful', token };
  }

  // Forgot Password
  async forgotPassword({ email }: ForgotPasswordBody) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('User not found');

    const resetToken = await this.jwtService.generateToken({ id: user._id }, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = renderTemplate('forgotPassword', { name: user.name, resetLink });

    await mailer.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html,
    });

    Logger.info(`Password reset link sent to ${user.email}`);
    return { message: 'Password reset link sent successfully' };
  }

  // Reset Password
  async resetPassword({ token, newPassword }: ResetPasswordBody) {
    const decoded = await this.jwtService.verify(token);
    const user = await this.userService.findById(decoded.id);
    if (!user) throw new Error('Invalid or expired token');

    const hashed = await this.bcryptService.hash(newPassword);
    await this.userService.updatePassword(user._id, hashed);

    Logger.info(`Password reset for ${user.email}`);
    return { message: 'Password reset successful' };
  }

  // Confirm Account
  async confirmAccount({ token }: ConfirmAccountBody) {
    const decoded = await this.jwtService.verify(token);
    const user = await this.userService.findById(decoded.id);
    if (!user) throw new Error('Invalid or expired confirmation token');

    const org = await this.organizationRepository.findOne({ email: user.email });
    if (!org) throw new Error('Organization not found');

    if (org.is_active) return { message: 'Account already confirmed' };

    await this.organizationRepository.updateById(
      org._id as string, // ✅ cast org._id to string
      { is_active: true }
    );

    Logger.info(`Account confirmed for ${user.email}`);
    return { message: 'Account confirmed successfully' };
  }
}
