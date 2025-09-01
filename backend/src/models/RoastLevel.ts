import mongoose, { Schema, Document } from "mongoose";

export interface RoastLevelDocument extends Document {
  id: number;
  name: string;
  description: string;
}

const roastLevelSchema = new Schema<RoastLevelDocument>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const RoastLevel = mongoose.model<RoastLevelDocument>(
  "RoastLevel",
  roastLevelSchema
);
