export interface IOrganization {
  _id?: string;
  name: string;
  city: string;
  address: string;
  state: string;
  country: string;
  pin_code: string;
  mobile_number: string;
  gst_number: string;
  pan_number: string;
  isApproved: boolean;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
