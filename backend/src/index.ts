import dotenv from "dotenv";
dotenv.config();
import { MONGO_URI, PORT } from "./config/config.js";
import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://coffee-app-nu-ten.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        origin === "https://coffee-app-nu-ten.vercel.app"
      ) {
        return callback(null, true);
      }

      callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(passport.initialize());

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Incoming request from origin:", req.headers.origin);
  next();
});

// Routes
import productRoutes from "./routes/products.js";
import ordersRoutes from "./routes/Paypal.js";
import adminRoutes from "./routes/admin/index.js";
import orderRoute from "./routes/admin/Orders.js";
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoute);

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
