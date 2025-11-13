import { Request, Response, NextFunction, RequestHandler } from 'express';
import { successResponse } from '@middleware/successResponse';
import { UserModel } from './user.entity';
import { UserRepository} from './user.repository';
import UserService from './user.service';
import { Logger } from '@lib/logger';
import JwtService from '@lib/jwt';
import BcryptService from '@lib/bcrypt';

class UserController {
  private userService: UserService;

  constructor(serviceLayer: UserService) {
    this.userService = serviceLayer;
  }

  public inviteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email} = req.body;
      const organizationId = req.user?.organizationId;  
      console.log('Organization ID from token:', organizationId);
      const invitation = await this.userService.inviteUser(email, organizationId);

      successResponse({
        res,
        message: 'Invitation sent successfully',
        data: invitation,
      });
    } catch (error) {
      Logger.error('Error inviting user', { error });
      next(error);
    }
  };
}

export const userController = new UserController(
  new UserService(
    new UserRepository(UserModel),
    new JwtService(),
    new BcryptService()
  )
);
