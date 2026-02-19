import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    googleId: { type: String },
    refreshToken: { type: String },
});
export const User = model("User", UserSchema);
