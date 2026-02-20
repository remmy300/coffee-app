import express from "express";
import { Product } from "../../models/Products.js";
import { adminOnly, protect } from "../../middleware/authMiddleware.js";
import upload from "../../middleware/upload.js";
import { uploadBuffer } from "../../utils/uploadToCloudinary.js";
import cloudinary from "../../config/cloudinary.js";
const router = express.Router();
// Protect all routes
router.use(protect, adminOnly);
router.get("/", async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});
const normalizeProductPayload = (body) => {
    const requiredText = [
        "name",
        "type",
        "roastLevel",
        "description",
        "roastDate",
    ];
    for (const key of requiredText) {
        if (!body[key] || typeof body[key] !== "string" || !body[key].trim()) {
            throw new Error(`Missing required field: ${key}`);
        }
    }
    const price = Number(body.price);
    const weight = Number(body.weight);
    const inventory = Number(body.inventory);
    if (!Number.isFinite(price) || price < 0) {
        throw new Error("Invalid price");
    }
    if (!Number.isFinite(weight) || weight <= 0) {
        throw new Error("Invalid weight");
    }
    if (!Number.isFinite(inventory) || inventory < 0) {
        throw new Error("Invalid inventory");
    }
    const id = typeof body.id === "string" && body.id.trim()
        ? body.id.trim()
        : `${body.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    return {
        id,
        name: body.name.trim(),
        type: body.type.trim(),
        roastLevel: body.roastLevel.trim(),
        description: body.description.trim(),
        roastDate: body.roastDate.trim(),
        price,
        weight,
        inventory,
        tastingNotes: Array.isArray(body.tastingNotes) ? body.tastingNotes : [],
        images: Array.isArray(body.images) ? body.images : [],
        variants: Array.isArray(body.variants) ? body.variants : [],
        isFeatured: Boolean(body.isFeatured),
        origin: body.origin?.trim() || undefined,
        region: body.region?.trim() || undefined,
        farm: body.farm?.trim() || undefined,
        altitude: body.altitude?.trim() || undefined,
        process: body.process?.trim() || undefined,
        decafProcess: body.decafProcess?.trim() || undefined,
        composition: Array.isArray(body.composition) ? body.composition : undefined,
        certifications: Array.isArray(body.certifications)
            ? body.certifications
            : undefined,
        brewMethods: Array.isArray(body.brewMethods) ? body.brewMethods : undefined,
        popularWith: Array.isArray(body.popularWith) ? body.popularWith : undefined,
        wholesalePrice: body.wholesalePrice === undefined || body.wholesalePrice === ""
            ? undefined
            : Number(body.wholesalePrice),
        score: body.score === undefined || body.score === ""
            ? undefined
            : Number(body.score),
    };
};
router.post("/", upload.array("images", 5), async (req, res) => {
    try {
        const payload = normalizeProductPayload(req.body);
        let uploadedImages = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const result = await uploadBuffer(file.buffer, "coffee-app/products");
                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }
        payload.images = uploadedImages;
        const product = await Product.create(payload);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.put("/:id", upload.array("images", 5), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Not found" });
        const payload = normalizeProductPayload(req.body);
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // Delete old images from Cloudinary
            if (product.images?.length) {
                for (const img of product.images) {
                    if (img.public_id) {
                        await cloudinary.uploader.destroy(img.public_id);
                    }
                }
            }
            let uploadedImages = [];
            for (const file of req.files) {
                const result = await uploadBuffer(file.buffer, "coffee");
                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
            payload.images = uploadedImages;
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, payload, {
            new: true,
        });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return res.status(404).json({ message: "product not found" });
    if (product.images?.length) {
        for (const img of product.images) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
});
export default router;
