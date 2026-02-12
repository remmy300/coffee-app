import dotenv from "dotenv";
dotenv.config();

import client from "../config/PaypalClient.js";

import express, { Request, Response } from "express";
import {
  ApiError,
  CheckoutPaymentIntent,
  OrdersController,
} from "@paypal/paypal-server-sdk";

const router = express.Router();
const ordersController = new OrdersController(client);

// Create PayPal order
router.post("/create-order", async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("create-order error", error);
    if (error instanceof ApiError) {
      res.status(500).json({ error: error.result });
    } else {
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  }
});

// Capture PayPal order
router.post("/capture-order", async (req: Request, res: Response) => {
  try {
    const { orderID } = req.body;
    const { result } = await ordersController.captureOrder(orderID);
    res.json({ capture: result });
  } catch (error) {
    console.error("capture-order error", error);
    if (error instanceof ApiError) {
      res.status(500).json({ error: error.result });
    } else {
      res.status(500).json({ error: "Failed to capture PayPal order" });
    }
  }
});

export default router;
