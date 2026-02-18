import mongoose, { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  role: "admin" | "customer";
  googleId?: string;
  refreshToken: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  googleId: { type: String },
  refreshToken: { type: String },
});

export const User = model<IUser>("User", UserSchema);
