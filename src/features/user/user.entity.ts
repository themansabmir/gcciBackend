import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name:
      { type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50 },

    email:
      { type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true },

    password:
      { type: String,
        required: true,
        minlength: 6 },

    role: { type: String,
      enum: ['admin', 'user'],
      default: 'user' },
    permissions: { type: [String],
      default: [] },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

export const UserModel = model<IUser>('User', userSchema);
