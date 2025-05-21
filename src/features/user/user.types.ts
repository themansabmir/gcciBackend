import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  permissions:String[]
  createdAt: Date;
  updatedAt: Date;
}
