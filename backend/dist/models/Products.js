import mongoose, { Schema } from "mongoose";
const variantSchema = new Schema({
    size: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    wholesaleOnly: { type: Boolean, default: false },
});
const productSchema = new Schema({
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
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],
    certifications: [String],
    brewMethods: [String],
    score: Number,
    variants: [variantSchema],
    popularWith: [String],
}, { timestamps: true });
export const Product = mongoose.model("Product", productSchema);
