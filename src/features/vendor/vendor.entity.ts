import { Schema, model } from 'mongoose';
import { IVendor, VendorTypeEnum } from './vendor.types';

const LocationSchema = new Schema({
  city: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pin_code: { type: String, required: true },
  telephone: { type: String, required: false },
  mobile_number: { type: String, required: true },
  fax: { type: String, required: false },
  gst_number: { type: String, required: true },
});

const VendorSchema = new Schema<IVendor>(
  {
    vendor_name: { type: String, required: true, unique: true, trim: true },
    vendor_type: { type: [String], enum: VendorTypeEnum, required: true },
    credit_days: { type: String, required: true },
    pan_number: { type: String, required: true },
    locations: {
      type: [LocationSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export const VendorEntity = model<IVendor>('Vendor', VendorSchema);
