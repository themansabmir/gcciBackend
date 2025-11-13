import { z } from 'zod';

// Signup Schema (Organization + Admin Customer)
export const signupSchema = z.object({
  // Organization details
  organizationName: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  state: z.string().min(2),
  country: z.string().min(2),
  pin_code: z.string().min(4),
  mobile_number: z.string().min(10),
  gst_number: z.string().min(15),
  pan_number: z.string().min(10),
  
  // Admin customer details
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
});
export type SignupBody = z.infer<typeof signupSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginBody = z.infer<typeof loginSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;

// Invite Customer
export const inviteCustomerSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'customer']).optional().default('customer'),
});
export type InviteCustomerBody = z.infer<typeof inviteCustomerSchema>;

// Reset Password (for invited customer)
export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
