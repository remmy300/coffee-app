import { useEffect, useState } from "react";
import type { PayPalNamespace } from "@paypal/paypal-js";

declare global {
  interface Window {
    paypal?: PayPalNamespace | null;
  }
}

export function usePayPalScript(clientId: string, currency = "USD") {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.paypal) {
      setLoaded(true);
      return;
    }

    // Check for existing script tag
    const existing = document.getElementById(
      "paypal-sdk"
    ) as HTMLScriptElement | null;
    if (existing) {
      // If the script exists but paypal not yet on window, wait for load/error events
      const onExistingLoad = () => setLoaded(true);
      const onExistingError = () =>
        setError(new Error("Failed to load PayPal SDK"));
      existing.addEventListener("load", onExistingLoad);
      existing.addEventListener("error", onExistingError);
      return () => {
        existing.removeEventListener("load", onExistingLoad);
        existing.removeEventListener("error", onExistingError);
      };
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;

    const onLoad = () => {
      setLoaded(true);
      setError(null);
    };
    const onError = () => {
      setError(new Error("Failed to load PayPal SDK"));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, [clientId, currency]);

  return { loaded, error };
}
