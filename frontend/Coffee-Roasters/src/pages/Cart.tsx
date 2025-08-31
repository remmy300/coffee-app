import { useCartContext } from "@/context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCartContext();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const delivery = 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + delivery + tax;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="h-20 w-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-lg">{item.name}</p>

                  <span>Quantity:{item.quantity || 1}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">
                  $ {item.price.toLocaleString()}
                </p>
                <p
                  className="text-sm text-amber-600 mt-2 cursor-pointer hover:underline"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </p>
              </div>
            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <div className="flex justify-start gap-4 pt-6">
            <Button
              onClick={() => navigate("/shop")}
              className="border px-4 py-2 bg-amber-600  hover:bg-amber-700"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Cart Summary */}
      <div className="border rounded-lg p-6 bg-white shadow-sm sticky top-24 self-start">
        <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>

        <div className="text-sm text-gray-700 space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>$ {delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>$ {tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-4">
          <span>Grand Total</span>
          <span>KSH {grandTotal.toLocaleString()}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="mt-6 w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors"
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
