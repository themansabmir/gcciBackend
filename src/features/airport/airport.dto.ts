// team.dto.ts
import { z } from "zod";

export const airport_validate = z.object({
  airport_name: z.string().min(3).max(30),
  airport_code: z.string(),
});

export const update_airport_validate = airport_validate.partial();
