import mongoose, { Schema } from "mongoose";
const roastLevelSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });
export const RoastLevel = mongoose.model("RoastLevel", roastLevelSchema);
