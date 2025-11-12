import { Schema, model, Document, Types } from 'mongoose';

export const VendorTypeEnum = [
  'cha',
  'agent',
  'shipper',
  'consignee',
  'shipping_line',
  'freight_forwarder',
] as const;

export type VendorType = typeof VendorTypeEnum[number];

export interface ILocation {
  city: string;
  address: string;
  state: string;
  country: string;
  pin_code: string;
  telephone: string;
  mobile_number: string;
  fax: string;
  gst_number: string;
  pan_number: string;
}

export interface IVendor extends Document {
  vendor_name: string;
  vendor_type: VendorType[];
  credit_days: string;
  locations: ILocation[];
  is_verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const LocationSchema = new Schema<ILocation>({
  city: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pin_code: { type: String, required: true },
  telephone: { type: String, required: true },
  mobile_number: { type: String, required: true },
  fax: { type: String, required: true },
  gst_number: { type: String, required: true },
  pan_number: { type: String, required: true },
});

const VendorSchema = new Schema<IVendor>(
  {
    vendor_name: { type: String, required: true },
    vendor_type: { type: [String], enum: VendorTypeEnum, required: true },
    credit_days: { type: String, default: '15' },
    locations: { type: [LocationSchema], required: true },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const VendorEntity = model<IVendor>('Vendor', VendorSchema);
export type IVendorDocument = IVendor & Document;
export default VendorEntity;
