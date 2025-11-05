import { RequestHandler } from 'express';
import OrganizationService from './organization.service';
import {
  SignUpBody,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  ConfirmAccountBody,
} from './organization.dto';
import { successResponse } from '@middleware/successResponse';
import JwtService from '@lib/jwt';
import BcryptService from '@lib/bcrypt';
import OrganizationRepository from './organization.repository';
import OrganizationEntity from './organization.entity';
import { Logger } from '@lib/logger';

class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  signup: RequestHandler<{}, any, SignUpBody> = async (req, res, next) => {
    try {
      const result = await this.organizationService.signup(req.body);
      successResponse({ res, message: result.message });
    } catch (err) {
      Logger.error('Signup Error', err);
      next(err);
    }
  };

  login: RequestHandler<{}, any, LoginBody> = async (req, res, next) => {
    try {
      const result = await this.organizationService.login(req.body);
      successResponse({ res, message: result.message, data: { token: result.token } });
    } catch (err) {
      Logger.error('Login Error', err);
      next(err);
    }
  };

  forgotPassword: RequestHandler<{}, any, ForgotPasswordBody> = async (req, res, next) => {
    try {
      const result = await this.organizationService.forgotPassword(req.body);
      successResponse({ res, message: result.message });
    } catch (err) {
      Logger.error('Forgot Password Error', err);
      next(err);
    }
  };

  resetPassword: RequestHandler<{}, any, ResetPasswordBody> = async (req, res, next) => {
    try {
      const result = await this.organizationService.resetPassword(req.body);
      successResponse({ res, message: result.message });
    } catch (err) {
      Logger.error('Reset Password Error', err);
      next(err);
    }
  };

  confirmAccount: RequestHandler<{}, any, ConfirmAccountBody> = async (req, res, next) => {
    try {
      const result = await this.organizationService.confirmAccount(req.body);
      successResponse({ res, message: result.message });
    } catch (err) {
      Logger.error('Confirm Account Error', err);
      next(err);
    }
  };
}

const jwtService = new JwtService();
const bcryptService = new BcryptService();
const organizationRepository = new OrganizationRepository();
const organizationService = new OrganizationService(organizationRepository, bcryptService, jwtService);
export const organizationController = new OrganizationController(organizationService);
