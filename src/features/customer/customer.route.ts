import express from 'express';
import { customerController } from './customer.controller';
import { validateToken } from '@middleware/routeProtector';

const customerRouter = express.Router();

// Auth routes (public - no authentication required)
customerRouter.post('/', customerController.signup);
customerRouter.post('/login', customerController.login);
customerRouter.post('/forgot-password', customerController.forgotPassword);
customerRouter.post('/reset-password', customerController.resetPassword);
customerRouter.post('/confirm-account', customerController.confirmAccount);

// Customer management routes (protected - authentication required)
customerRouter.post('/invite', validateToken, customerController.inviteCustomer);

customerRouter.get('/profile', validateToken, customerController.getProfile);
customerRouter.patch('/profile', validateToken, customerController.updateProfile);

export default customerRouter;
