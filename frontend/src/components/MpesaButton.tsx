import type { CoffeeProduct } from "@/types";
import { useState } from "react";

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

export default function MpesaButton({
  total,
  name,
  email,
  phone,
  address,
  cartItems,
  onSuccess,
  onFailure,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const initiateMpesa = async () => {
    try {
      if (!API_URL) {
        throw new Error("VITE_API_URL is missing in frontend environment");
      }
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/payments/mpesa/initiate`, {
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
      });

      const data = await res.json();
      if (!res.ok || !data.localOrderId) {
        throw new Error(data.message || "M-Pesa initiation failed");
      }

      sessionStorage.setItem("checkout_order_id", data.localOrderId);
      onSuccess?.(data.localOrderId);
    } catch (error: any) {
      onFailure?.(error?.message || "Failed to initiate M-Pesa payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={initiateMpesa}
      disabled={submitting}
      className="group flex w-full items-center justify-between rounded-md border border-green-700 bg-[#43B02A] px-4 py-3 text-white shadow-sm transition hover:bg-[#3A9A24] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
          M
        </span>
        <span className="text-left">
          <span className="block text-sm leading-none">M-Pesa</span>
          <span className="block text-xs text-white/90">
            {submitting ? "Sending STK Push..." : "Pay with M-Pesa"}
          </span>
        </span>
      </span>
    </button>
  );
}
