import dotenv from "dotenv";
dotenv.config(); // Load .env variables immediately
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
