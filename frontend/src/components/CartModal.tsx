import { useCartContext } from "@/context/CartContext";
import { ShoppingBagIcon } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CartModal = () => {
  const [onOpen, setOnOpen] = useState<boolean>(false);
  const { cartItems, removeFromCart } = useCartContext();
  const navigate = useNavigate();

  return (
    <Dialog open={onOpen} onOpenChange={setOnOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="open cart"
          onClick={() => setOnOpen(true)}
          className="p-2 relative"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="fixed flex flex-col rounded-none right-0  bottom-0 left-auto overflow-y-auto h-screen max-w-4xl  translate-x-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
        <div className="h-full flex flex-col w-full">
          <div className="absolute bg-black/5" />
          <DialogHeader className="border-b p-4 top-0 z-10">
            <DialogTitle>Shopping Cart</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full gap-4">
                <ShoppingBagIcon size={100} className="text-gray-300" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-40 w-40 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm font-semibold text-gray-500">
                        $ {item.price}
                      </p>
                      <p
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-amber-700 hover:underline cursor-pointer"
                      >
                        Remove
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <DialogFooter className="p-4 border-t flex- flex-col">
              <Button
                onClick={() => {
                  setOnOpen(false);
                  navigate("/cart");
                }}
                className="w-1/2` bg-amber-600 hover:bg-amber-700"
              >
                View Cart
              </Button>
              <Button
                onClick={() => {
                  navigate("/checkout");
                  setOnOpen(false);
                }}
                className="w-1/2 bg-amber-600 hover:bg-amber-700"
              >
                Continue to Checkout
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
