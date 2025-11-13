import { Schema, model, Document, InferSchemaType } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pin_code: { type: String, required: true },
    mobile_number: { type: String, required: true },
    gst_number: { type: String, required: true },
    pan_number: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Infer the schema type for TypeScript
export type IOrganization = InferSchemaType<typeof OrganizationSchema>;
export type IOrganizationDocument = IOrganization & Document;

// ✅ Export the model
export const OrganizationEntity = model<IOrganizationDocument>(
  "Organization",
  OrganizationSchema
);

export default OrganizationEntity;

