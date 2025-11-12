import express from 'express';
import OrganizationController from './organization.controller';
import OrganizationService from './organization.service';
import OrganizationRepository from './organization.repository';
import BcryptService from '@lib/bcrypt';
import JwtService from '@lib/jwt';
import UserService from 'features/user/user.service';

const router = express.Router();

const bcryptService = new BcryptService();
const userService = new UserService(bcryptService);
const orgRepo = new OrganizationRepository();
const jwtService = new JwtService();
const orgService = new OrganizationService(orgRepo, bcryptService, jwtService, userService);
const orgController = new OrganizationController(orgService);

router.post('/signup', orgController.signup);
router.post('/login', orgController.login);
router.post('/forgot-password', orgController.forgotPassword);
router.post('/reset-password', orgController.resetPassword);
router.post('/confirm-account', orgController.confirmAccount);

export default router;
