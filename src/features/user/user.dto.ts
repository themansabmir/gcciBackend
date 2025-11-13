// src/modules/user/user.dto.ts
import { z } from "zod";

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  permissions?: string[];
}

// ✅ Zod schema for validation
export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
  email: z.string().email("Invalid email format").optional(),
  permissions: z.array(z.string()).optional(),
});
