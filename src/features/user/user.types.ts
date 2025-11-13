
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  role: "admin" | "user"
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  organizationId?: Types.ObjectId;
  isVerified: boolean;
  status: "active" | "invited";
  inviteToken?: string;
  inviteExpiresAt?: Date;
}
