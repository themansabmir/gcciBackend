import { z } from "zod";

const lineItemSchema = z.object({
  serviceItem: z.string().min(1, "Service item is required"),
  hsn: z.string().optional(),
  rate: z.number().min(0).default(0),
  currency: z.string().default("INR"),
  unit: z.string().optional(),
  exchangeRate: z.number().min(0).default(1),
  quantity: z.number().min(0).default(1),
  pricePerUnit: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  taxableAmount: z.number().min(0).default(0),
  gstPercent: z.string().default("0"),
  gstAmount: z.number().min(0).default(0),
  totalWithGst: z.number().min(0).default(0)
});

export const finance_validate = z.object({
  _id: z.string().optional(),
  shipmentId: z.string().min(1, "Shipment ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  type: z.enum(["proforma", "invoice", "credit_note"], {
    errorMap: () => ({ message: "Type must be one of: proforma, invoice, credit_note" })
  }),
  status: z.enum(["draft", "sent", "acknowledged", "paid", "issued", "cancelled"]).default("draft"),
  parentDocumentId: z.string().optional(),
  documentNumber: z.string().min(1, "Document number is required"),
  issueDate: z.string(),
  dueDate: z.string().optional(),
  lineItems: z.array(lineItemSchema).default([]),
  currency: z.string().default("INR"),
  net_discount: z.number().min(0, "Subtotal must be non-negative"),
  net_taxable: z.number().min(0).default(0),
  net_gst: z.number().min(0).default(0),
  grand_total: z.number().min(0, "Grand total must be non-negative"),
  acknowledgedAt: z.string().optional(),
  paidAt: z.string().optional() || z.null()
});

export const update_finance_validate = finance_validate.partial();
