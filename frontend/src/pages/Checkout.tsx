import { useCartContext } from "@/context/CartContext";
import { useState, useMemo } from "react";
import PayPalButton from "@/components/PaypalButton";
import MpesaButton from "@/components/MpesaButton";

function CheckoutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "mpesa">(
    "paypal",
  );
  const [message, setMessage] = useState("");

  const { cartItems, clearCart } = useCartContext();

  // calculate total using useMemo so it recalculates only when cart changes
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Cart Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between py-2 text-gray-700"
              >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="flex justify-between mt-4 font-semibold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Coffee Street, Nairobi"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Select Payment Method
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-medium ${
                paymentMethod === "paypal"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal Method
            </button>
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-medium ${
                paymentMethod === "mpesa"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setPaymentMethod("mpesa")}
            >
              M-Pesa Method
            </button>
          </div>

          {message ? (
            <p className="text-sm text-gray-700 rounded bg-gray-100 px-3 py-2">
              {message}
            </p>
          ) : null}

          <div className="mt-3">
            {paymentMethod === "paypal" ? (
              <PayPalButton
                total={total}
                name={name}
                email={email}
                phone={phone}
                address={address}
                cartItems={cartItems}
                onSuccess={() => {
                  clearCart();
                  setMessage("Payment successful.");
                }}
                onFailure={(error) => setMessage(error)}
              />
            ) : (
              <MpesaButton
                total={total}
                name={name}
                email={email}
                phone={phone}
                address={address}
                cartItems={cartItems}
                onSuccess={() => setMessage("M-Pesa request sent")}
                onFailure={(error) => setMessage(error)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
