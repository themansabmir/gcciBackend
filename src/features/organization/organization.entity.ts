import { Schema, model, Document, Types } from 'mongoose';

export interface IOrganization extends Document {
      organization_name: string;
      email: string;
      vendorRef: Types.ObjectId;
      userRef: Types.ObjectId;
      is_active?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
        organization_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        vendorRef: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
        userRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OrganizationEntity = model<IOrganization>('Organization', OrganizationSchema);
export type IOrganizationDocument = IOrganization & Document;
export default OrganizationEntity;
