import express from "express";
import { Product } from "../../models/Products.js";
import { adminOnly, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect, adminOnly);

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const normalizeProductPayload = (body: any) => {
  const requiredText = ["name", "type", "roastLevel", "description", "roastDate"];
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

  const id =
    typeof body.id === "string" && body.id.trim()
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
    wholesalePrice:
      body.wholesalePrice === undefined || body.wholesalePrice === ""
        ? undefined
        : Number(body.wholesalePrice),
    score:
      body.score === undefined || body.score === "" ? undefined : Number(body.score),
  };
};

router.post("/", async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    const product = await Product.create(payload);
    console.log("Added product:", product);

    res.status(201).json(product);
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ message: error.message || "Error adding product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error updating product" });
  }
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
