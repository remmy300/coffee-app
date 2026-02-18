import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: {
    product: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentProvider?: "paypal" | "mpesa";
  paymentRef?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;

  idempotencyKey?: string;
  paymentEvents?: {
    stage: string;
    status: "pending" | "paid" | "failed";
    message?: string;
    providerRef?: string;
    payload?: unknown;
    madeAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    shippingAddress: { type: String },
    items: [
      {
        product: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentProvider: {
      type: String,
      enum: ["paypal", "mpesa"],
      required: false,
    },
    paymentRef: { type: String },
    paypalOrderId: { type: String, required: false },
    paypalCaptureId: { type: String, required: false },

    idempotencyKey: { type: String, unique: true, sparse: true },
    paymentEvents: [
      {
        stage: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "paid", "failed"],
          required: true,
        },
        message: { type: String },
        providerRef: { type: String },
        payload: { type: Schema.Types.Mixed },
        madeAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
