import { z } from 'zod';

// Basic helpers for formats
const phoneRegex = /^[0-9]{6,15}$/;
const mobileRegex = /^[6-9]\d{9}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pinCodeRegex = /^[1-9][0-9]{5}$/;

const VendorTypeEnum = ['cha', 'agent', 'shipper', 'consignee', 'shipping_line', 'freight_forwarder'] as const;

const VendorTypeEnumSchema = z.enum(VendorTypeEnum);

export const LocationSchema = z.object({
  city: z.string().min(2, 'City must be at least 2 characters long'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  pin_code: z.string().regex(pinCodeRegex, 'Invalid PIN code'),
  telephone: z.string().regex(phoneRegex, 'Invalid telephone number'),
  mobile_number: z.string().regex(mobileRegex, 'Invalid mobile number'),
  email: z.string().email('Invalid email address').optional(),
  fax: z
    .string()
    .optional()
    .or(z.literal('').or(z.string().regex(phoneRegex, 'Invalid fax number'))),
  gst_number: z.string().regex(gstRegex, 'Invalid GST number'),
  pan_number: z.string().regex(panRegex, 'Invalid PAN number'),
});

// Vendor schema
export const createVendorDTO = z.object({
  vendor_name: z.string(),
  vendor_type: z.array(VendorTypeEnumSchema),
  credit_days: z.string(),
  pan_number: z.string().regex(panRegex, 'Invalid PAN number'),
  locations: z.array(LocationSchema),
});
