import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
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
}, { timestamps: true });
export const Order = mongoose.model("Order", orderSchema);
