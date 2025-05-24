import { NextFunction, Request, RequestHandler, Response } from 'express';
import AuthService from './auth.service';
import { IUpdatePassword, LoginBody, SignUpBody } from './auth.dto';
import { Logger } from '@lib/logger';
import JwtService from '@lib/jwt';
import BcryptService from '@lib/bcrypt';
import TeamRepository from '@features/team/team.repository';
import TeamEntity from '@features/team/team.entity';
import { successResponse } from '@middleware/successResponse';

class AuthController {
  private authService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public login: RequestHandler<{}, any, LoginBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginBody = req.body;
      const user = await this.authService.login(loginBody);
      successResponse({ res, response: user, message: 'Login Successfully' });
    } catch (error) {
      Logger.error('Login Error', error);
      next(error);
    }
  };
  public signup: RequestHandler<{}, any, SignUpBody> = async (req: Request<{}, any, SignUpBody>, res: Response, next: NextFunction) => {
    try {
      const signupBody = req.body;
      await this.authService.signup(signupBody);
      successResponse({ res, message: 'New user added successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updatePassword: RequestHandler<{ id: string }, any, IUpdatePassword> = async (
    req: Request<{ id: string }, any, IUpdatePassword>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const updatePasswordBody = req.body;

      await this.authService.updatePassword(id, updatePasswordBody);
      successResponse({ res, message: 'Password updated successfully' });
    } catch (error) {
      Logger.error('Update Password Error', error);
      next(error);
    }
  };
}

const jwtService = new JwtService();
const bcryptService = new BcryptService();
const teamRepository = new TeamRepository(TeamEntity);
const authService = new AuthService(teamRepository, bcryptService, jwtService);
export const authController = new AuthController(authService);
