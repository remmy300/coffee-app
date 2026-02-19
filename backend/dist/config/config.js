import dotenv from "dotenv";
dotenv.config(); // Load .env variables immediately
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
