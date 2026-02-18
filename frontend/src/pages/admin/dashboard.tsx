import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/adminApi";
import { Card, CardContent } from "@/components/ui/card";

type RevenuePoint = {
  _id: string;
  revenue: number;
  orders: number;
};

type TopProduct = {
  name: string;
  quantity: number;
  revenue: number;
};

type LowStockProduct = {
  _id: string;
  name: string;
  type: string;
  inventory: number;
};

type RecentOrder = {
  _id: string;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

type AnalyticsResponse = {
  totals: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    pendingOrders: number;
    paidOrders: number;
    failedPayments: number;
    averageOrderValue: number;
  };
  revenueTrend: RevenuePoint[];
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
};

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery<AnalyticsResponse>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await adminApi.get("/analytics");
      return res.data?.data ?? res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Failed to load analytics</p>;

  const totals = data.totals;
  const cards = [
    { title: "Total Revenue", value: `$${totals.totalRevenue.toFixed(2)}` },
    { title: "Total Orders", value: totals.totalOrders },
    { title: "Total Products", value: totals.totalProducts },
    { title: "Pending Orders", value: totals.pendingOrders },
    { title: "Paid Orders", value: totals.paidOrders },
    { title: "Failed Payments", value: totals.failedPayments },
    { title: "Average Order Value", value: `$${totals.averageOrderValue.toFixed(2)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <h2 className="text-2xl font-bold">{card.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
            {data.revenueTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent sales data.</p>
            ) : (
              <div className="space-y-3">
                {data.revenueTrend.map((point) => (
                  <div key={point._id} className="flex items-center justify-between text-sm">
                    <span>{point._id}</span>
                    <span>
                      ${point.revenue.toFixed(2)} ({point.orders} orders)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Top Products</h3>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product sales yet.</p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product) => (
                  <div key={product.name} className="flex items-center justify-between text-sm">
                    <span>{product.name}</span>
                    <span>
                      {product.quantity} sold | ${product.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
            {data.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No low stock alerts.</p>
            ) : (
              <div className="space-y-3">
                {data.lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between text-sm">
                    <span>
                      {product.name} ({product.type})
                    </span>
                    <span>{product.inventory} left</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Recent Orders</h3>
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent orders.</p>
            ) : (
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <div key={order._id} className="text-sm">
                    <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                    <p className="text-muted-foreground">
                      {order.orderStatus} | {order.paymentStatus} |{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
