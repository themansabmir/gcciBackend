import { z } from 'zod';

// validation schemas
export const RoleEnum = z.enum(['admin', 'editor']);

export const loginschema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  first_name: z.string().max(50),
  last_name: z.string().max(50),
  role: RoleEnum.default('editor'),
  permissions: z.array(z.string()),
  is_active: z.boolean().default(true),
});
export const updatePasswordSchema = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
});

// types
export interface LoginBody {
  email: string;
  password: string;
}
// export interface SignUpBody {

//     username: string;
//     first_name: string
// }
export type SignUpBody = z.infer<typeof SignupSchema>;
export interface IUpdatePassword {
  password: string;
  newPassword: string;
}
