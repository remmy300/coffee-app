import dotenv from "dotenv";
dotenv.config();
import { MONGO_URI, PORT } from "./config/config.js";
import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app: Application = express();

console.log("ENV check PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log(
  "ENV check PAYPAL_CLIENT_SECRET:",
  process.env.PAYPAL_CLIENT_SECRET
);

const allowedOrigins = [
  "http://localhost:3000",
  "https://coffee-app-nu-ten.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
import productRoutes from "./routes/products.js";
import ordersRoutes from "./routes/Paypal.js";
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Server error" });
});

// MongoDB connection
// const MONGO_URI = process.env.MONGO_URI as string;
// const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  })
  .catch((err: unknown) => {
    console.error("MongoDB connection error ", err);
    process.exit(1); // exit app if DB connection fails
  });
