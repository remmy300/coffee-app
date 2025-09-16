import dotenv from "dotenv";
dotenv.config();
import client from "../config/PaypalClient.js";
import express from "express";
import { ApiError, CheckoutPaymentIntent, OrdersController, } from "@paypal/paypal-server-sdk";
const router = express.Router();
const ordersController = new OrdersController(client);
console.log("PayPal Client ID from Paypal route:", process.env.PAYPAL_CLIENT_ID);
console.log("PayPal Secret from Paypal route:", process.env.PAYPAL_CLIENT_SECRET);
// Create PayPal order
router.post("/create-order", async (req, res) => {
    try {
        console.log("Received create-order request:", req.body);
        const { total } = req.body;
        // Validate input
        if (!total || isNaN(total)) {
            return res.status(400).json({ error: "Invalid total amount" });
        }
        const collect = {
            body: {
                intent: CheckoutPaymentIntent.Capture,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: total.toFixed(2),
                        },
                    },
                ],
            },
            prefer: "return=minimal",
        };
        console.log("Creating PayPal order with:", collect);
        const { result } = await ordersController.createOrder(collect);
        res.json({ orderID: result.id });
        console.log("PayPal order created successfully:", result.id);
    }
    catch (error) {
        console.error("create-order error", error);
        if (error instanceof ApiError) {
            res.status(500).json({ error: error.result });
        }
        else {
            res.status(500).json({ error: "Failed to create PayPal order" });
        }
    }
});
// Capture PayPal order
router.post("/capture-order", async (req, res) => {
    try {
        const { orderID } = req.body;
        const { result } = await ordersController.captureOrder(orderID);
        res.json({ capture: result });
    }
    catch (error) {
        console.error("capture-order error", error);
        if (error instanceof ApiError) {
            res.status(500).json({ error: error.result });
        }
        else {
            res.status(500).json({ error: "Failed to capture PayPal order" });
        }
    }
});
export default router;
