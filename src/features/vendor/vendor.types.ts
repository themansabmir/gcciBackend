import { Document, } from "mongoose";

export const VendorTypeEnum = [
  "cha",
  "agent",
  "shipper",
  "consignee",
  "shipping_line",
  "freight_forwarder",
] as const;
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
  pan_number: string;
}

export interface IVendor extends Document {
  vendor_name: string;
  vendor_type: typeof VendorTypeEnum;
  credit_days: string;
  locations: ILocation[];
}


export interface IQuery  {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  [key: string]: any;
}
export type IVendorUpdateBody = Partial<IVendor>;
