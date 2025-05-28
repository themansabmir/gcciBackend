// port.dto.ts
import { z } from "zod";

export const port_validate = z.object({
  port_name: z.string().min(3).max(30),
  port_code: z.string(),
});

export const update_port_validate = port_validate.partial();
