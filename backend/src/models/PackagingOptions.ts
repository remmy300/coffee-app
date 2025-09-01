import mongoose, { Schema, Document } from "mongoose";

export interface PackagingOptionDocument extends Document {
  size: string;
  type: string;
  material: string;
}

const packagingOptionSchema = new Schema<PackagingOptionDocument>(
  {
    size: { type: String, required: true },
    type: { type: String, required: true },
    material: { type: String, required: true },
  },
  { timestamps: true }
);

export const PackagingOption = mongoose.model<PackagingOptionDocument>(
  "PackagingOption",
  packagingOptionSchema
);
