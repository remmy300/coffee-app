import { Router } from "express";
import { Order } from "../../models/Orders.js";
import { adminOnly, protect } from "../../middleware/authMiddleware.js";
import { Server } from "http";

const router = Router();

router.get("/", async (req, res) => {
  const orders = await Order.find({ paymentStatus: String }).populate(
    "user",
    "name email",
  );
  res.json(orders);
});

router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

export default router;
