import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
import productRoutes from "./routes/products.js";
app.use("/api/products", productRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
});
// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
mongoose
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB connected successfully ✅");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} 🚀`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1); // exit app if DB connection fails
});
