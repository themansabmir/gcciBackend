import { z } from 'zod';

// Sign Up
export const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
export type SignUpBody = z.infer<typeof SignupSchema>;

// Login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginBody = z.infer<typeof LoginSchema>;

// Update Password
export const updatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8),
});
export type IUpdatePassword = z.infer<typeof updatePasswordSchema>;

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;

// Reset Password
export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;

// Confirm Account
export const confirmAccountSchema = z.object({
  token: z.string(),
});
export type ConfirmAccountBody = z.infer<typeof confirmAccountSchema>;
