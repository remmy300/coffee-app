import express from "express";
import mongoose from "mongoose";
import { Product } from "../models/Products.js";
const router = express.Router();
// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ status: "ok", data: products });
    }
    catch (err) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});
// GET product by ID
router.get("/:id", async (req, res) => {
    try {
        const requestedId = req.params.id;
        const orConditions = [
            { id: requestedId },
        ];
        if (mongoose.Types.ObjectId.isValid(requestedId)) {
            orConditions.push({ _id: requestedId });
        }
        const product = await Product.findOne({ $or: orConditions });
        if (!product) {
            return res.status(404).json({ status: "error", message: "Not found" });
        }
        res.json({ status: "ok", data: product });
    }
    catch (err) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});
export default router;
