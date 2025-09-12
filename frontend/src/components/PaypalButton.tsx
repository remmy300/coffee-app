// components/PayPalButton.tsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import type { CoffeeProduct } from "@/types";

type Props = {
  total: number;
  name: string;
  address: string;
  cartItems: CoffeeProduct[];
};

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);

export default function PayPalButton({
  total,
  name,
  address,
  cartItems,
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
        createOrder={async () => {
          try {
            console.log("Sending create-order request with total:", total);

            const res = await fetch(`${API_URL}/api/orders/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ total, name, address, cartItems }),
            });

            const data = await res.json();
            console.log("Create-order response:", data);

            if (!data.orderID) {
              throw new Error(
                `Backend did not return an orderID. Response: ${JSON.stringify(
                  data
                )}`
              );
            }

            return data.orderID;
          } catch (err) {
            console.error("createOrder failed:", err);
            throw err;
          }
        }}
        onApprove={async (data) => {
          try {
            console.log("Approving order with ID:", data.orderID);

            const res = await fetch(`${API_URL}/api/orders/capture-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });

            const captureData = await res.json();
            console.log("Capture-order response:", captureData);

            alert("Payment successful! 🎉");
          } catch (err) {
            console.error("captureOrder failed:", err);
            alert("Payment failed");
          }
        }}
        onError={(err) => {
          console.error("PayPal Checkout error:", err);
          alert("Payment failed");
        }}
      />
    </PayPalScriptProvider>
  );
}
