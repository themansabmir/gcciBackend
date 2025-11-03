import express from 'express';
import { organizationController } from './organization.controller';

const router = express.Router();

// Organization routes
router.post('/signup', organizationController.signup);
router.post('/login', organizationController.login);
router.post('/forgot-password', organizationController.forgotPassword);
router.post('/reset-password', organizationController.resetPassword);
router.post('/confirm-account', organizationController.confirmAccount);

export default router;
