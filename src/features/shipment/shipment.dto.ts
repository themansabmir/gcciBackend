import { z } from 'zod';

export const shipmentRequestBody = z.object({
  shipment_type: z.enum(['IMP', 'EXP']),
  created_by: z.string().min(3).max(30),
});
