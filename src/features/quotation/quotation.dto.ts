import { z } from 'zod';
import { QUOTATION_STATUS } from './quotation.types';

export const CreateQuotationLineItemSchema = z.object({
  chargeName: z.string(),
  hsnCode: z.string(),
  price: z.number(),
  currency: z.string(),
  quantity: z.number(),
});

export const CreateQuotationSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  shippingLineId: z.string(),
  startPortId: z.string(),
  endPortId: z.string(),
  containerType: z.string(),
  containerSize: z.string(),
  tradeType: z.string(),
  validFrom: z.string().transform((val) => new Date(val)),
  validTo: z.string().transform((val) => new Date(val)),
  lineItems: z.array(CreateQuotationLineItemSchema).min(1),
});

export const UpdateQuotationSchema = CreateQuotationSchema.partial();

export const QuotationFilterSchema = z.object({
  status: z.nativeEnum(QUOTATION_STATUS).optional(),
  customerId: z.string().optional(),
  dateFrom: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  dateTo: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  search: z.string().optional(),
});
