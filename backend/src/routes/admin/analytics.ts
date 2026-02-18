import { Router } from "express";
import { Order } from "../../models/Orders.js";
import { Product } from "../../models/Products.js";

const router = Router();
router.get("/", async (_req, res) => {
  try {
    const totalRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });

    const paidOrders = await Order.countDocuments({ paymentStatus: "paid" });
    const failedPayments = await Order.countDocuments({ paymentStatus: "failed" });
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    const trendStart = new Date();
    trendStart.setDate(trendStart.getDate() - 6);
    trendStart.setHours(0, 0, 0, 0);

    const revenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: trendStart },
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: 1, quantity: 1, revenue: 1 } },
    ]);

    const lowStockProducts = await Product.find({ inventory: { $lte: 10 } })
      .sort({ inventory: 1 })
      .select("name inventory type")
      .limit(5)
      .lean();

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .select("totalPrice paymentStatus orderStatus createdAt")
      .limit(5)
      .lean();

    res.json({
      totals: {
        totalRevenue,
        totalOrders,
        totalProducts,
        pendingOrders,
        paidOrders,
        failedPayments,
        averageOrderValue,
      },
      revenueTrend,
      topProducts,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

export default router;
