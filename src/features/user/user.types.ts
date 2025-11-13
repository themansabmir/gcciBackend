import { Document } from "mongoose";
import Types from "mongoose"

export interface IUser extends Document {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  permissions:String[]
  createdAt: Date;
  updatedAt: Date;
}
