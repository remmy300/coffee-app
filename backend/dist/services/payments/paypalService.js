import { ApiError, CheckoutPaymentIntent, OrdersController, } from "@paypal/paypal-server-sdk";
import client from "../../config/PaypalClient.js";
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../../config/config.js";
const ordersController = new OrdersController(client);
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
export const createPaypalOrder = async (total, currencyCode = "USD") => {
    const collect = {
        body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
                {
                    amount: {
                        currencyCode,
                        value: total.toFixed(2),
                    },
                },
            ],
        },
        prefer: "return=minimal",
    };
    const { result } = await ordersController.createOrder(collect);
    return result;
};
export const capturePaypalOrder = async (paypalOrderId) => {
    try {
        const { result } = await ordersController.captureOrder({
            id: paypalOrderId,
        });
        return result;
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw new Error(typeof error.result === "string"
                ? error.result
                : JSON.stringify(error.result));
        }
        throw error;
    }
};
const getPaypalAccessToken = async () => {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });
    if (!response.ok) {
        throw new Error(`PayPal OAuth failed: ${response.statusText}`);
    }
    const data = (await response.json());
    if (!data.access_token) {
        throw new Error("PayPal OAuth token missing");
    }
    return data.access_token;
};
export const verifyPaypalWebhookSignature = async (args) => {
    const token = await getPaypalAccessToken();
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            auth_algo: args.authAlgo,
            cert_url: args.certUrl,
            transmission_id: args.transmissionId,
            transmission_sig: args.transmissionSig,
            transmission_time: args.transmissionTime,
            webhook_id: args.webhookId,
            webhook_event: args.webhookEvent,
        }),
    });
    if (!response.ok) {
        throw new Error(`PayPal webhook verification failed: ${response.statusText}`);
    }
    const data = (await response.json());
    return data.verification_status === "SUCCESS";
};
