import mongoose, { Schema, Document } from "mongoose";

export interface ProcessDocument extends Document {
  name: string;
}

const processSchema = new Schema<ProcessDocument>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Process = mongoose.model<ProcessDocument>(
  "Process",
  processSchema
);
