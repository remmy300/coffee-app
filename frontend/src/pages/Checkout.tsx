import { useCartContext } from "@/context/CartContext";
import { useState, useMemo } from "react";
import PayPalButton from "@/components/PaypalButton";

function CheckoutPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const { cartItems } = useCartContext();

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
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Coffee Street, Nairobi"
            />
          </div>

          <div className="mt-3">
            <PayPalButton
              total={total}
              name={name}
              address={address}
              cartItems={cartItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
