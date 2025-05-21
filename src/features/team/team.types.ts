import { Document } from "mongoose";

export interface ITeam extends Document  {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  permissions?: String[];
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
