import { z } from 'zod';

/**
 * Organization DTOs
 * Note: Auth-related schemas have been moved to customer.dto.ts
 */

// Update Organization
export const updateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  state: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  pin_code: z.string().min(4).optional(),
  mobile_number: z.string().min(10).optional(),
  gst_number: z.string().min(15).optional(),
  pan_number: z.string().min(10).optional(),
});
export type UpdateOrganizationBody = z.infer<typeof updateOrganizationSchema>;
