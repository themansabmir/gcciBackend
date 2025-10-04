import { z } from "zod";

export const invoiceitem_validate = z.object({
  _id: z.string().optional(),
  hsn_code: z.string().min(1, "HSN code is required").trim(),
  fieldName: z.string().min(1, "Field name is required").max(100, "Field name too long").trim(),
  gst: z.union([z.number().min(0), z.string().min(1)], {
    errorMap: () => ({ message: "GST must be a valid number or string" })
  }),
  unit: z.enum(['container', 'bl', 'wm'], {
    errorMap: () => ({ message: "Unit must be one of: container, bl, wm" })
  })
});

export const update_invoiceitem_validate = invoiceitem_validate.partial();
