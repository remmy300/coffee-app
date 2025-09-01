import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

// Import routes
import productRoutes from "./routes/products.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
