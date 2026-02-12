import express, { Application, Router } from "express";
import { adminOnly, protect } from "../../middleware/authMiddleware.js";
import authRoutes from "../admin/auth.js";
import productRoutes from "../admin/Products.js";
import orderRoutes from "../admin/Orders.js";

const app: Application = express();

const router = Router();
router.use("/auth", authRoutes);

router.use(protect, adminOnly);

router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
