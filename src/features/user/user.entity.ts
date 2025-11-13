
import { Schema, model } from "mongoose";
import { IUser } from "./user.types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    permissions: { type: [String], default: [] },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "invited"], default: "active" },
    inviteToken: { type: String },
    inviteExpiresAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const UserModel = model<IUser>("User", userSchema);
