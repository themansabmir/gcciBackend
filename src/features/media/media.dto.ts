import { z } from 'zod';

export const mediaRequestBody = z.object({
  shipment_folder_id: z.string(),
  file_name: z.string(),
  created_by: z.string(),
  url: z.string().url(),
});
