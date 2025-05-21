import { Schema, model } from "mongoose";
import { IUser } from "./user.types";


const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    permissions: {
      type: [String]
    }
  },
  {
    timestamps: true, // Automatically manages createdAt & updatedAt
  }
);

// Optional: add index
userSchema.index({ email: 1 });

export const UserModel = model<IUser>("User", userSchema);
