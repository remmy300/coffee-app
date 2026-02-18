import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/adminApi";
import { Button } from "@/components/ui/button";

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: { name: string; quantity: number }[];
  user?: { name: string; email: string };
}

const Orders = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await adminApi.get("/orders");
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      adminApi.put(`/orders/${id}`, { orderStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/orders/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.trim().toLowerCase();
      const customerName = order.user?.name?.toLowerCase() || "";
      const customerEmail = order.user?.email?.toLowerCase() || "";
      const id = order._id.toLowerCase();

      const matchesSearch =
        !q ||
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        id.includes(q);
      const matchesOrderStatus =
        orderStatusFilter === "all" || order.orderStatus === orderStatusFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;

      return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
    });
  }, [orders, search, orderStatusFilter, paymentStatusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <div className="flex flex-col gap-2 md:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or order id"
            className="h-9 rounded-md border px-3 text-sm"
          />

          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm"
          >
            <option value="all">All order statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm"
          >
            <option value="all">All payment statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="border rounded-md">
        <table className="w-full text-left">
          <thead className="border-b bg-muted">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Order Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4" colSpan={8}>
                  Loading orders...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td className="p-4 text-red-600" colSpan={8}>
                  Failed to load orders.
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={8}>
                  No orders matched your filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: Order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-4 text-xs">{order._id.slice(-8)}</td>
                  <td className="p-4">
                    <p>{order.user?.name || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.user?.email || "-"}
                    </p>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">
                    {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </td>
                  <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4 capitalize">{order.paymentStatus}</td>
                  <td className="p-4 capitalize">{order.orderStatus}</td>

                  <td className="p-4 space-x-2">
                    {order.orderStatus !== "shipped" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: order._id,
                            orderStatus: "shipped",
                          })
                        }
                      >
                        Mark Shipped
                      </Button>
                    )}
                    {order.orderStatus !== "delivered" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: order._id,
                            orderStatus: "delivered",
                          })
                        }
                      >
                        Mark Delivered
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteOrderMutation.mutate(order._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
