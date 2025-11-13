import { Schema, model, Document, InferSchemaType } from "mongoose";

const OrganizationSchema = new Schema(
  {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      is_active: { type: Boolean, default: false },
      verificationToken: { type: String, default: null },
      resetToken: { type: String, default: null },
      resetTokenExpires: { type: Date, default: null },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }]
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

