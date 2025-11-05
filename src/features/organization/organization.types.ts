export interface IOrganization {
  _id?: string;
  name: string;
  email: string;
  password: string;
  is_active?: boolean;
  created_at?: Date;
}
