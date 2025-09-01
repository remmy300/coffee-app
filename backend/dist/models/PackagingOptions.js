import mongoose, { Schema } from "mongoose";
const packagingOptionSchema = new Schema({
    size: { type: String, required: true },
    type: { type: String, required: true },
    material: { type: String, required: true },
}, { timestamps: true });
export const PackagingOption = mongoose.model("PackagingOption", packagingOptionSchema);
