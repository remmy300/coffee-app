import express, { RequestHandler } from "express";
import { Product } from "../../models/Products.js";
import { adminOnly, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect, adminOnly);

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(product);
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
