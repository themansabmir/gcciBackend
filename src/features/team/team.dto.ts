// team.dto.ts
import { z } from "zod";

export const RoleEnum = z.enum(["admin", "editor"]);

export const createTeamSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  first_name: z.string().max(50),
  last_name: z.string().max(50),
  role: RoleEnum.default("admin"),
  permissions: z.array(z.string()),
  is_active: z.boolean().default(true),
});


export const loginschema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type loginDTO = z.infer<typeof loginschema>

export const updateTeamDTO = createTeamSchema.partial();
