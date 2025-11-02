import OrganizationRepository from './organization.repository';
import { SignUpBody, LoginBody, ForgotPasswordBody, ResetPasswordBody, ConfirmAccountBody } from './organization.dto';
import BcryptService from '@lib/bcrypt';
import JwtService from '@lib/jwt';
import { mailer } from '@lib/mail';
import { Logger } from '@lib/logger';

export default class OrganizationService {
  private organizationRepository: OrganizationRepository;
  private bcryptService: BcryptService;
  private jwtService: JwtService;

  constructor(organizationRepository: OrganizationRepository, bcryptService: BcryptService, jwtService: JwtService) {
    this.organizationRepository = organizationRepository;
    this.bcryptService = bcryptService;
    this.jwtService = jwtService;
  }

  async signup(body: SignUpBody) {
    const existing = await this.organizationRepository.findOne({ email: body.email });
    if (existing) throw new Error('Email already exists');

    const hashedPassword = await this.bcryptService.hash(body.password);
    const newOrg = await this.organizationRepository.create({
      ...body,
      password: hashedPassword,
    });

    const confirmToken = await this.jwtService.generateToken({ id: newOrg._id }, { expiresIn: '21d' }); //increase time
    const confirmLink = `${process.env.FRONTEND_URL}/confirm-account?token=${confirmToken}`;

    await mailer.sendMail({
      to: newOrg.email,
      subject: 'Confirm Your Account',
      html: `<p>Hello ${newOrg.name},</p>
             <p>Click below to confirm your account:</p>
             <a href="${confirmLink}" target="_blank">Confirm Account</a>`,
    });

    Logger.info(`Signup successful for ${newOrg.email}`);
    return { message: 'Signup successful. Please check your email to confirm your account.' };
  }

  async login(body: LoginBody) {
    const org = await this.organizationRepository.findOne({ email: body.email });
    if (!org) throw new Error('Invalid credentials');

    const isValid = await this.bcryptService.compare(body.password, org.password);
    if (!isValid) throw new Error('Invalid credentials');
    if (!org.is_active) throw new Error('Account not confirmed');

    const token = await this.jwtService.generateToken({ id: org._id });
    return { message: 'Login successful', token };
  }

  async forgotPassword({ email }: ForgotPasswordBody) {
    const org = await this.organizationRepository.findOne({ email });
    if (!org) throw new Error('User not found');

    const resetToken = await this.jwtService.generateToken({ id: org._id }, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await mailer.sendMail({
      to: org.email,
      subject: 'Password Reset Request',
      html: `<p>Hello ${org.name},</p>
             <p>You requested a password reset. Click below to reset your password:</p>
             <a href="${resetLink}" target="_blank">Reset Password</a>
             <p>This link expires in 15 minutes.</p>`,
    });

    Logger.info(`Password reset link sent to ${org.email}`);
    return { message: 'Password reset link sent successfully' };
  }

  async resetPassword({ token, newPassword }: ResetPasswordBody) {
    const decoded = await this.jwtService.verify(token);
    const org = await this.organizationRepository.findById(decoded.id);
    if (!org) throw new Error('Invalid or expired token');

    const hashed = await this.bcryptService.hash(newPassword);
    await this.organizationRepository.updateById(String(org._id), { password: hashed });

    Logger.info(`Password reset for ${org.email}`);
    return { message: 'Password reset successful' };
  }

  async confirmAccount({ token }: ConfirmAccountBody) {
    const decoded = await this.jwtService.verify(token);
    const org = await this.organizationRepository.findById(decoded.id);
    if (!org) throw new Error('Invalid or expired confirmation token');

    if (org.is_active) return { message: 'Account already confirmed' };
    await this.organizationRepository.updateById(String(org._id), { is_active: true });

    Logger.info(`Account confirmed for ${org.email}`);
    return { message: 'Account confirmed successfully' };
  }
}
