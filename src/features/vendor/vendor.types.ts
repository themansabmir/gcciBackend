import { Document } from 'mongoose';

export const VendorTypeEnum = ['cha', 'agent', 'shipper', 'consignee', 'shipping_line', 'freight_forwarder'] as const;
interface ILocation {
  city: string;
  address: string;
  state: string;
  country: string;
  pin_code: string;
  telephone: string;
  mobile_number: string;
  fax: string;
  gst_number: string;
  email?: string;
}

export interface IVendor extends Document {
  vendor_name: string;
  vendor_type: typeof VendorTypeEnum;
  credit_days: string;
  pan_number: string;
  is_active: boolean;
  primary_email: string;
  primary_mobile_number: string;
  locations: ILocation[];
}

export interface IQuery {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  [key: string]: any;
}
export type IVendorUpdateBody = Partial<IVendor>;
