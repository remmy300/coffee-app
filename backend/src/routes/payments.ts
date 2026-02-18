import crypto from "crypto";
import express from "express";
import mongoose from "mongoose";
import { Order } from "../models/Orders.js";
import { Product } from "../models/Products.js";
import {
  capturePaypalOrder,
  createPaypalOrder,
  verifyPaypalWebhookSignature,
} from "../services/payments/paypalService.js";
import { initiateMpesaStkPush } from "../services/payments/mpesaService.js";

const router = express.Router();

type CheckoutItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type CheckoutPayload = {
  total?: number;
  cartItems: CheckoutItem[];
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  localOrderId?: string;
};

// Rate limit the payment requests
const PAYMENT_WINDOW_MS = 60 * 1000;
const paymentRateState = new Map<string, { count: number; resetAt: number }>();
const paymentRateLimit = (maxRequests: number) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const current = paymentRateState.get(key);
    if (!current || current.resetAt < now) {
      paymentRateState.set(key, { count: 1, resetAt: now + PAYMENT_WINDOW_MS });
      return next();
    }

    if (current.count >= maxRequests) {
      return res
        .status(429)
        .json({ message: "Too many payment requests. Try again shortly." });
    }

    current.count += 1;
    paymentRateState.set(key, current);
    return next();
  };
};

// Payload sanitization to prevent malicious data from reaching the backend and payment providers
const isValidCheckoutPayload = (payload: Partial<CheckoutPayload>) => {
  return Array.isArray(payload?.cartItems) && payload.cartItems.length > 0;
};

const sanitizeText = (value: unknown, max = 120) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
};

const parseCheckoutPayload = (body: any) => {
  const cartItems = Array.isArray(body?.cartItems) ? body.cartItems : [];
  if (!isValidCheckoutPayload({ cartItems })) {
    throw new Error("Invalid checkout payload");
  }

  const normalizedItems = cartItems.map((item: any) => {
    const id = sanitizeText(item?.id, 64);
    const quantity = Number(item?.quantity);
    if (!id || !Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("Invalid cart item payload");
    }
    return {
      id,
      name: sanitizeText(item?.name, 160) || "",
      quantity,
      price: Number(item?.price) || 0,
    } as CheckoutItem;
  });

  return {
    total: typeof body?.total === "number" ? body.total : undefined,
    cartItems: normalizedItems,
    name: sanitizeText(body?.name, 120),
    address: sanitizeText(body?.address, 240),
    email: sanitizeText(body?.email, 160),
    phone: sanitizeText(body?.phone, 32),
    localOrderId: sanitizeText(body?.localOrderId, 64),
  } as CheckoutPayload;
};

const isValidPhone = (phone?: string): phone is string => {
  if (!phone) return false;
  return /^(?:\+?254|0)?7\d{8}$/.test(phone.replace(/\s+/g, ""));
};

// Server-Side cart validation
const computeOrderFromDb = async (cartItems: CheckoutItem[]) => {
  const normalized = cartItems.map((item) => ({
    id: String(item.id),
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
  }));

  const uniqueIds = Array.from(new Set(normalized.map((item) => item.id)));
  const products = await Product.find({ id: { $in: uniqueIds } })
    .select("id name price")
    .lean();

  const productById = new Map(products.map((p) => [String((p as any).id), p]));

  const pricedItems = normalized.map((item) => {
    const product = productById.get(item.id);
    if (!product) {
      throw new Error(`Product not found for cart item id: ${item.id}`);
    }
    return {
      product: item.id,
      name: String((product as any).name),
      quantity: item.quantity,
      price: Number((product as any).price),
    };
  });

  const total = pricedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  if (total <= 0) throw new Error("Invalid cart total");

  return { pricedItems, total };
};

//capture history of payment events in every order
const appendOrderEvent = (
  order: any,
  event: {
    stage: string;
    status: "pending" | "paid" | "failed";
    providerRef?: string;
    message?: string;
    payload?: unknown;
  },
) => {
  order.paymentEvents?.push({
    stage: event.stage,
    status: event.status,
    providerRef: event.providerRef,
    message: event.message,
    payload: event.payload,
    madeAt: new Date(),
  });
};

// prevents duplicates of  mpesa callback and webhooks
const hasProcessedMpesaCallback = (
  order: any,
  checkoutRequestId: string,
  status: "paid" | "failed",
) => {
  return (order.paymentEvents || []).some(
    (evt: any) =>
      evt?.stage === "mpesa_callback" &&
      evt?.providerRef === checkoutRequestId &&
      evt?.status === status,
  );
};

const hasProcessedPaypalWebhook = (order: any, eventId: string) => {
  return (order.paymentEvents || []).some(
    (evt: any) =>
      evt?.stage === "paypal_webhook" && evt?.providerRef === eventId,
  );
};

// create orders
const createCheckoutOrder = async (
  payload: Omit<CheckoutPayload, "cartItems" | "total"> & {
    cartItems: {
      product: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    total: number;
  },
  provider: "paypal" | "mpesa",
) => {
  return Order.create({
    customerName: payload.name || undefined,
    customerEmail: payload.email || undefined,
    customerPhone: payload.phone || undefined,
    shippingAddress: payload.address || undefined,
    items: payload.cartItems,
    totalPrice: payload.total,
    paymentStatus: "pending",
    orderStatus: "pending",
    paymentProvider: provider,
    idempotencyKey: crypto.randomUUID(),
    paymentEvents: [
      { stage: `${provider}_initiate`, status: "pending", madeAt: new Date() },
    ],
  });
};

router.use("/paypal/create-order", paymentRateLimit(20));
router.use("/paypal/capture-order", paymentRateLimit(25));
router.use("/paypal/webhook", paymentRateLimit(120));
router.use("/mpesa/initiate", paymentRateLimit(20));
router.use("/mpesa/callback", paymentRateLimit(120));

router.post("/paypal/create-order", async (req, res) => {
  try {
    const { total, name, address, email, phone, cartItems } =
      parseCheckoutPayload(req.body);

    const { pricedItems, total: serverTotal } =
      await computeOrderFromDb(cartItems);
    if (typeof total === "number" && Math.abs(total - serverTotal) > 0.01) {
      return res.status(400).json({ message: "Cart total mismatch" });
    }

    const order = await createCheckoutOrder(
      {
        total: serverTotal,
        name,
        address,
        email,
        phone,
        cartItems: pricedItems,
      },
      "paypal",
    );

    const paypalOrder = await createPaypalOrder(serverTotal, "USD");
    order.paypalOrderId = paypalOrder.id;
    order.paymentRef = paypalOrder.id;
    appendOrderEvent(order, {
      stage: "paypal_order_created",
      status: "pending",
      providerRef: paypalOrder.id,
      payload: paypalOrder,
    });
    await order.save();

    return res.json({ orderID: paypalOrder.id, localOrderId: order._id });
  } catch (error: any) {
    console.error("paypal/create-order error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Failed to create order" });
  }
});

router.post("/paypal/capture-order", async (req, res) => {
  try {
    const { orderID, localOrderId } = req.body as {
      orderID?: string;
      localOrderId?: string;
    };
    if (!sanitizeText(orderID, 64) || !sanitizeText(localOrderId, 64)) {
      return res
        .status(400)
        .json({ message: "orderID and localOrderId are required" });
    }
    if (!mongoose.isValidObjectId(localOrderId as string)) {
      return res.status(400).json({ message: "Invalid localOrderId" });
    }

    const order = await Order.findById(localOrderId as string);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "paid") {
      return res.json({ ok: true, alreadyCaptured: true, orderId: order._id });
    }

    const capture = await capturePaypalOrder(orderID as string);
    const status = (capture as any)?.status;
    const captureId = (capture as any)?.purchaseUnits?.[0]?.payments
      ?.captures?.[0]?.id;

    if (status === "COMPLETED") {
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      order.paypalCaptureId = captureId;
      order.paymentRef = captureId || orderID;
      appendOrderEvent(order, {
        stage: "paypal_capture",
        status: "paid",
        providerRef: captureId || orderID,
        payload: capture,
      });
      await order.save();
      return res.json({
        ok: true,
        status: "paid",
        orderId: order._id,
        captureId,
      });
    }

    order.paymentStatus = "failed";
    appendOrderEvent(order, {
      stage: "paypal_capture",
      status: "failed",
      providerRef: orderID,
      payload: capture,
    });
    await order.save();
    return res
      .status(400)
      .json({ ok: false, status: "failed", orderId: order._id });
  } catch (error: any) {
    console.error("paypal/capture-order error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Failed to capture payment" });
  }
});

router.post("/mpesa/initiate", async (req, res) => {
  try {
    const { total, name, address, email, phone, cartItems, localOrderId } =
      parseCheckoutPayload(req.body);
    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .json({ message: "Valid phone number is required" });
    }

    let order = localOrderId ? await Order.findById(localOrderId) : null;

    if (!order) {
      const { pricedItems, total: serverTotal } =
        await computeOrderFromDb(cartItems);
      if (typeof total === "number" && Math.abs(total - serverTotal) > 0.01) {
        return res.status(400).json({ message: "Cart total mismatch" });
      }

      order = await createCheckoutOrder(
        {
          total: serverTotal,
          name,
          address,
          email,
          phone,
          cartItems: pricedItems,
        },
        "mpesa",
      );
    }

    if (order.paymentStatus === "paid") {
      return res.json({ ok: true, alreadyPaid: true, localOrderId: order._id });
    }

    const stk = await initiateMpesaStkPush({
      phone,
      amount: order.totalPrice,
      accountReference: String(order._id),
      transactionDesc: "Coffee order payment",
    });

    order.paymentProvider = "mpesa";
    order.paymentRef = stk.checkoutRequestId;
    appendOrderEvent(order, {
      stage: "mpesa_stk_sent",
      status: "pending",
      providerRef: stk.checkoutRequestId,
      payload: stk.raw || stk,
    });
    await order.save();

    return res.json({
      ok: true,
      localOrderId: order._id,
      checkoutRequestId: stk.checkoutRequestId,
      customerMessage: stk.customerMessage,
      mock: stk.mock,
    });
  } catch (error: any) {
    console.error("mpesa/initiate error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Failed to initiate M-Pesa" });
  }
});

router.post("/mpesa/callback", async (req, res) => {
  try {
    const expectedCallbackToken = process.env.MPESA_CALLBACK_TOKEN;
    const providedToken =
      typeof req.query.token === "string" ? req.query.token : undefined;
    if (expectedCallbackToken && providedToken !== expectedCallbackToken) {
      return res.status(401).json({ message: "Invalid callback token" });
    }

    const callback =
      req.body?.Body?.stkCallback || req.body?.stkCallback || req.body;
    const checkoutRequestId =
      callback?.CheckoutRequestID ||
      callback?.checkoutRequestId ||
      callback?.CheckoutRequestId;
    const resultCode = Number(
      callback?.ResultCode ?? callback?.resultCode ?? 1,
    );
    const resultDesc =
      callback?.ResultDesc || callback?.resultDesc || "Unknown result";

    if (!checkoutRequestId) {
      return res.status(400).json({ message: "CheckoutRequestID missing" });
    }

    const order = await Order.findOne({ paymentRef: checkoutRequestId });
    if (!order) return res.json({ ok: true, ignored: true });

    if (order.paymentStatus === "paid") {
      return res.json({ ok: true, alreadyProcessed: true });
    }

    if (resultCode === 0) {
      if (hasProcessedMpesaCallback(order, checkoutRequestId, "paid")) {
        return res.json({ ok: true, duplicate: true });
      }
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      appendOrderEvent(order, {
        stage: "mpesa_callback",
        status: "paid",
        message: resultDesc,
        providerRef: checkoutRequestId,
        payload: req.body,
      });
    } else {
      if (hasProcessedMpesaCallback(order, checkoutRequestId, "failed")) {
        return res.json({ ok: true, duplicate: true });
      }
      order.paymentStatus = "failed";
      appendOrderEvent(order, {
        stage: "mpesa_callback",
        status: "failed",
        message: resultDesc,
        providerRef: checkoutRequestId,
        payload: req.body,
      });
    }

    await order.save();
    return res.json({ ok: true });
  } catch (error: any) {
    console.error("mpesa/callback error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Callback handling failed" });
  }
});

router.post("/paypal/webhook", async (req, res) => {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      return res
        .status(500)
        .json({ message: "PAYPAL_WEBHOOK_ID is not configured" });
    }

    const authAlgo = req.header("paypal-auth-algo");
    const certUrl = req.header("paypal-cert-url");
    const transmissionId = req.header("paypal-transmission-id");
    const transmissionSig = req.header("paypal-transmission-sig");
    const transmissionTime = req.header("paypal-transmission-time");
    if (
      !authAlgo ||
      !certUrl ||
      !transmissionId ||
      !transmissionSig ||
      !transmissionTime
    ) {
      return res
        .status(400)
        .json({ message: "Missing PayPal signature headers" });
    }

    const signatureValid = await verifyPaypalWebhookSignature({
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookEvent: req.body,
      webhookId,
    });

    if (!signatureValid) {
      return res
        .status(401)
        .json({ message: "Invalid PayPal webhook signature" });
    }

    const eventType = sanitizeText(req.body?.event_type, 80);
    const eventId = sanitizeText(req.body?.id, 80);
    if (!eventType || !eventId) {
      return res
        .status(400)
        .json({ message: "Malformed PayPal webhook event" });
    }

    const captureId = sanitizeText(req.body?.resource?.id, 80);
    const paypalOrderId = sanitizeText(
      req.body?.resource?.supplementary_data?.related_ids?.order_id,
      80,
    );

    const order = await Order.findOne({
      paymentProvider: "paypal",
      $or: [{ paypalCaptureId: captureId }, { paypalOrderId: paypalOrderId }],
    });
    if (!order) {
      return res.json({ ok: true, ignored: true });
    }

    if (hasProcessedPaypalWebhook(order, eventId)) {
      return res.json({ ok: true, duplicate: true });
    }

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      order.paymentRef = captureId || paypalOrderId || order.paymentRef;
      appendOrderEvent(order, {
        stage: "paypal_webhook",
        status: "paid",
        providerRef: eventId,
        message: eventType,
        payload: req.body,
      });
      await order.save();
      return res.json({ ok: true, status: "paid" });
    }

    if (
      eventType === "PAYMENT.CAPTURE.DENIED" ||
      eventType === "PAYMENT.CAPTURE.REVERSED" ||
      eventType === "PAYMENT.CAPTURE.REFUNDED"
    ) {
      order.paymentStatus = "failed";
      appendOrderEvent(order, {
        stage: "paypal_webhook",
        status: "failed",
        providerRef: eventId,
        message: eventType,
        payload: req.body,
      });
      await order.save();
      return res.json({ ok: true, status: "failed" });
    }

    appendOrderEvent(order, {
      stage: "paypal_webhook",
      status: order.paymentStatus === "paid" ? "paid" : "pending",
      providerRef: eventId,
      message: `Ignored event type: ${eventType}`,
      payload: req.body,
    });
    await order.save();
    return res.json({ ok: true, ignored: true });
  } catch (error: any) {
    console.error("paypal/webhook error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Failed to handle PayPal webhook" });
  }
});

router.get("/orders/:orderId/status", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(req.params.orderId).select(
      "_id paymentStatus orderStatus paymentProvider paymentRef totalPrice createdAt",
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error?.message || "Failed to fetch status" });
  }
});

export default router;
