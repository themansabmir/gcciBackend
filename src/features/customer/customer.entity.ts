
import { Schema, model } from "mongoose";
import { ICustomer } from "./customer.types";

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    permissions: { type: [String], default: [] },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "invited"], default: "active" },
    inviteToken: { type: String },
    inviteExpiresAt: { type: Date },
  },
  { timestamps: true }
);

customerSchema.index({ email: 1 });
customerSchema.index({ organizationId: 1 });

export const CustomerModel = model<ICustomer>("Customer", customerSchema);

