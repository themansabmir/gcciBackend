import { z } from 'zod';

const LineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Unit price cannot be negative'),
  discount: z.number().optional(),
  tax_percentage: z.number().min(0).max(100),
});

const CustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  billing_address: z.string().min(1, 'Billing address is required'),
  shipping_address: z.string().min(1, 'Shipping address is required'),
  contact: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
  }),
  tax_id: z.string().optional(),
});

const CompanySchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    address: z.string().min(1, 'Company address is required'),
    phone: z.string().min(1, 'Company phone number is required'),
    email: z.string().email('Invalid email address'),
});


export const createProformaInvoiceDTO = z.object({
  issue_date: z.string().transform((str) => new Date(str)),
  valid_until: z.string().transform((str) => new Date(str)),
  customer: CustomerSchema,
  company: CompanySchema,
  line_items: z.array(LineItemSchema).min(1, 'At least one line item is required'),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
  created_by: z.string(), // Assuming this will be the user's ID
});

export const updateProformaInvoiceDTO = createProformaInvoiceDTO.partial();
