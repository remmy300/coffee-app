import mongoose, { Schema, Document } from "mongoose";

export interface Variant {
  size: string;
  sku: string;
  price: number;
  wholesaleOnly?: boolean;
}

export interface ProductDocument extends Document {
  id: string;
  name: string;
  type: string;
  origin?: string;
  region?: string;
  farm?: string;
  altitude?: string;
  process?: string;
  decafProcess?: string;
  composition?: string[];
  roastLevel: string;
  tastingNotes: string[];
  description: string;
  price: number;
  wholesalePrice?: number;
  weight: number;
  inventory: number;
  roastDate: string;
  isFeatured: boolean;
  images: string[];
  certifications?: string[];
  brewMethods?: string[];
  score?: number;
  variants: Variant[];
  popularWith?: string[];
}

const variantSchema = new Schema<Variant>({
  size: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  wholesaleOnly: { type: Boolean, default: false },
});

const productSchema = new Schema<ProductDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    origin: String,
    region: String,
    farm: String,
    altitude: String,
    process: String,
    decafProcess: String,
    composition: [String],
    roastLevel: { type: String, required: true },
    tastingNotes: [String],
    description: { type: String, required: true },
    price: { type: Number, required: true },
    wholesalePrice: Number,
    weight: { type: Number, required: true },
    inventory: { type: Number, required: true },
    roastDate: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    images: [String],
    certifications: [String],
    brewMethods: [String],
    score: Number,
    variants: [variantSchema],
    popularWith: [String],
  },
  { timestamps: true }
);

export const Product = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);
