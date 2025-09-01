import mongoose, { Schema } from "mongoose";
const processSchema = new Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });
export const Process = mongoose.model("Process", processSchema);
