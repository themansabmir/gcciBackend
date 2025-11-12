import TeamRepository from '@features/team/team.repository';
import BcryptService from '@lib/bcrypt';
import { IUpdatePassword, LoginBody, SignUpBody } from './auth.dto';
import JwtService from '@lib/jwt';
import { Logger } from '@lib/logger';

export default class AuthService {
  private teamRepository;
  private bcryptService;
  private jwtService;
  constructor(teamRepository: TeamRepository, bcryptService: BcryptService, jwtService: JwtService) {
    this.teamRepository = teamRepository;
    this.bcryptService = bcryptService;
    this.jwtService = jwtService;
  }

  private async profileValidation(findBy: { email?: string; _id?: string }, password: string) {
    const isAccount = await this.teamRepository.findOne(findBy);
    if (!isAccount) throw new Error('User does not exist');
    Logger.info('Account trying to login', { user: isAccount?.email });
    if (!isAccount.is_active) throw new Error('Your profile is temporarily disabled by system administrator');
    const isPasswordValid = await this.bcryptService.compare(password, isAccount.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');
    return;
  }

  public async login(loginBody: LoginBody) {
    try {
      Logger.info('LOGGING IN INIT');
      const { email, password } = loginBody;
      const isAccount = await this.teamRepository.findOne({ email });
      await this.profileValidation({ email }, password);
      let access_token = '';
      let jwtPayload = {};

      if (isAccount) {
        jwtPayload = {
          id: isAccount._id,
          email: isAccount.email,
          first_name: isAccount.first_name,
          last_name: isAccount.last_name,
          role: isAccount.role,
          permissions: isAccount.permissions,
          is_active: isAccount.is_active,
        };

        access_token = await this.jwtService.generateToken(jwtPayload);
      }
      Logger.info('Login Complete');
      return {
        access_token,
        ...jwtPayload,
      };
    } catch (error) {
      Logger.error('SERVER ERROR:LOGIN', error);
      throw error;
    }
  }

  public async signup(signUpBody: Partial<SignUpBody>) {
    try {
      Logger.info('SIGNUP INIT', signUpBody);
      const { email } = signUpBody;

      const randomPassword = '123456789';
      const isAccount = await this.teamRepository.findOne({ email });
      if (isAccount) throw new Error('User already exists with this email');
      const hashedPassword = await this.bcryptService.hash(randomPassword);
      const userPayload = {
        ...signUpBody,
        password: hashedPassword,
      };

      const newUser = await this.teamRepository.create(userPayload);

      // create org

      // create vendor

      const resetPwdToken = await this.jwtService.generateToken({ id: newuser._id });

      Logger.info('NEW USER ADDED SUCCESSFULLY', { data: newUser.email });
      return newUser;
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      throw error;
    }
  }

  public async updatePassword(id: string, updatePasswordBody: IUpdatePassword) {
    try {
      const { password, newPassword } = updatePasswordBody;
      await this.profileValidation({ _id: id }, password);
      const newHashedPassword = await this.bcryptService.hash(newPassword);
      await this.teamRepository.updateById(id, { password: newHashedPassword });
      return;
    } catch (error) {
      throw error;
    }
  }
}
