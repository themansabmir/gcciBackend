import { Types } from "mongoose";
import { Logger } from "@lib/logger";
import JwtService from "@lib/jwt";
import { mailer } from "@lib/mail";
import BcryptService from "@lib/bcrypt";
import { UserRepository } from "./user.repository";
export default class UserService {
  private userRepository: UserRepository;
  private jwtService: JwtService;
  private bcryptService: BcryptService;

  constructor(userRepository: UserRepository, jwtService: JwtService,bycryptService: BcryptService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.bcryptService = bycryptService;
  }

  public async inviteUser(email: string, organizationId: string) {
    try {
      if (!Types.ObjectId.isValid(organizationId)) {
        throw new Error("Invalid organization ID");
      }

      const existingUser = await this.userRepository.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // generate random temp password and hash it
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await this.bcryptService.hash(randomPassword);

 
      const token = await this.jwtService.generateToken({ email, organizationId });
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const newUser = await this.userRepository.create({
        email,
        password: hashedPassword,
        organizationId: new Types.ObjectId(organizationId),
        status: "invited",
        isVerified: false,
        inviteToken: token,
        inviteExpiresAt: expiresAt,
      });

      const invitationLink = `http://localhost:5173/invite?token=${token}`;

      const html =`<h2>You are invited to join our organization</h2>
      <p>Please click the link below to accept the invitation and set your password:</p>
      <a href="${invitationLink}">Accept Invitation</a>
      <p>Your temporary password is: <strong>${randomPassword}</strong></p>
      <p>This link will expire in 7 days.</p>`;
  
      await mailer.sendMail({
        to: email,
        subject: "You are invited to join our organization",
        html,
      });

      Logger.info("Invitation created", { email, organizationId });
      return {
  id: newUser._id,
  email: newUser.email,
  status: newUser.status
};
    } catch (error: any) {
  Logger.error('Error in inviteUser service', {
    message: error.message,
    stack: error.stack,
    email,
    organizationId,
  });
  throw error;
}

  }
}
