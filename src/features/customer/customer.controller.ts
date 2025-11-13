import { Request, Response, NextFunction, RequestHandler } from 'express';
import { successResponse } from '@middleware/successResponse';
import { CustomerModel } from './customer.entity';
import { CustomerRepository } from './customer.repository';
import CustomerService from './customer.service';
import { Logger } from '@lib/logger';
import JwtService from '@lib/jwt';
import BcryptService from '@lib/bcrypt';
import { SignupBody, LoginBody, ForgotPasswordBody, InviteCustomerBody, ResetPasswordBody, ConfirmAccountBody } from './customer.dto';
import OrganizationRepository from '../organization/organization.repository';
import { VendorRepository } from '../vendor/vendor.repository';
import { VendorEntity } from '../vendor/vendor.entity';

class CustomerController {
  private customerService: CustomerService;

  constructor(serviceLayer: CustomerService) {
    this.customerService = serviceLayer;
  }

  /**
   * Signup - Register organization and admin customer
   */
  public signup: RequestHandler<{}, any, SignupBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.customerService.signup(req.body);

      successResponse({
        res,
        message: result.message,
        response: {
          organizationId: result.organizationId,
          customerId: result.customerId,
        },
      });
    } catch (error) {
      Logger.error('Error in signup', { error });
      next(error);
    }
  };

  /**
   * Login - Authenticate customer
   */
  public login: RequestHandler<{}, any, LoginBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.customerService.login(req.body);

      successResponse({
        res,
        message: result.message,
        response: {
          token: result.token,
          customer: result.customer,
        },
      });
    } catch (error) {
      Logger.error('Error in login', { error });
      next(error);
    }
  };

  /**
   * Forgot Password - Send reset password link
   */
  public forgotPassword: RequestHandler<{}, any, ForgotPasswordBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.customerService.forgotPassword(req.body);

      successResponse({
        res,
        message: result.message,
      });
    } catch (error) {
      Logger.error('Error in forgot password', { error });
      next(error);
    }
  };

  /**
   * Invite a customer to the organization
   */
  public inviteCustomer: RequestHandler<{}, any, InviteCustomerBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = req.user?.organizationId;
      
      if (!organizationId) {
        throw new Error('Organization ID not found in token');
      }

      const invitation = await this.customerService.inviteCustomer(req.body, organizationId);

      successResponse({
        res,
        message: 'Invitation sent successfully',
        response: invitation,
      });
    } catch (error) {
      Logger.error('Error inviting customer', { error });
      next(error);
    }
  };

  /**
   * Reset password with token
   */
  public resetPassword: RequestHandler<{}, any, ResetPasswordBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.customerService.resetPassword(req.body);

      successResponse({
        res,
        message: result.message,
      });
    } catch (error) {
      Logger.error('Error resetting password', { error });
      next(error);
    }
  };

  /**
   * Confirm account via email link
   */
  public confirmAccount: RequestHandler<{}, any, ConfirmAccountBody> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.customerService.confirmAccount(req.body.token);

      successResponse({
        res,
        message: result.message,
      });
    } catch (error) {
      Logger.error('Error confirming account', { error });
      next(error);
    }
  };
}

export const customerController = new CustomerController(
  new CustomerService(
    new CustomerRepository(CustomerModel),
    new OrganizationRepository(),
    new VendorRepository(VendorEntity),
    new JwtService(),
    new BcryptService()
  )
);
