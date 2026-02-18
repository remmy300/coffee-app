import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import type { CoffeeProduct } from "@/types";

type Props = {
  total: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  cartItems: CoffeeProduct[];
  onSuccess?: (orderId: string) => void;
  onFailure?: (message: string) => void;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function PayPalButton({
  total,
  name,
  email,
  phone,
  address,
  cartItems,
  onSuccess,
  onFailure,
}: Props) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
        vault: true, // saves funding source for returning users
      }}
    >
      <PayPalButtons
        fundingSource="paypal" // prioritizes PayPal login over guest cards
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          tagline: false,
        }}
        onApprove={async (data) => {
          try {
            const localOrderId = sessionStorage.getItem("checkout_order_id");
            if (!localOrderId) {
              throw new Error("Missing local order id");
            }

            const res = await fetch(
              `${API_URL}/api/payments/paypal/capture-order`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID, localOrderId }),
              },
            );

            const captureData = await res.json();
            if (!res.ok) {
              throw new Error(captureData.message || "Capture failed");
            }
            onSuccess?.(localOrderId);
          } catch (err) {
            console.error("captureOrder failed:", err);
            onFailure?.("PayPal capture failed");
          }
        }}
        onError={(err) => {
          console.error("PayPal Checkout error:", err);
          onFailure?.("PayPal checkout failed");
        }}
        createOrder={async () => {
          try {
            if (!API_URL) {
              throw new Error("VITE_API_URL is missing in frontend environment");
            }
            const res = await fetch(
              `${API_URL}/api/payments/paypal/create-order`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  total,
                  name,
                  email,
                  phone,
                  address,
                  cartItems,
                }),
              },
            );

            const data = await res.json();
            if (!res.ok || !data.orderID || !data.localOrderId) {
              throw new Error(data.message || "Could not create PayPal order");
            }

            sessionStorage.setItem("checkout_order_id", data.localOrderId);
            return data.orderID as string;
          } catch (err) {
            console.error("createOrder failed:", err);
            onFailure?.("Failed to create PayPal order");
            throw err;
          }
        }}
      />
    </PayPalScriptProvider>
  );
}
