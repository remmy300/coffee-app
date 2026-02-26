import express from "express";
import mongoose from "mongoose";
import { Product } from "../models/Products.js";
import { cacheWrapper } from "../utils/cache.js";
const router = express.Router();
// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await cacheWrapper("products:all", 300, async () => {
            return await Product.find();
        });
        res.json({ status: "ok", data: products });
    }
    catch (err) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});
// GET product by ID
router.get("/:id", async (req, res) => {
    const requestedId = req.params.id;
    const cachedKey = `products:${requestedId}`;
    try {
        const product = await cacheWrapper(cachedKey, 300, async () => {
            const orConditions = [
                { id: requestedId },
            ];
            if (mongoose.Types.ObjectId.isValid(requestedId)) {
                orConditions.push({ _id: requestedId });
            }
            const result = await Product.findOne({ $or: orConditions });
            return result;
        });
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
