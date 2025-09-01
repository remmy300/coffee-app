import { createContext, useContext, useState } from "react";

import type { CoffeeProduct } from "@/types";

interface CartContextType {
  cartItems: CoffeeProduct[];
  addToCart: (product: CoffeeProduct) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CoffeeProduct[]>([]);

  const addToCart = (product: CoffeeProduct) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity ?? 1) + 1,
                price:
                  typeof item.price === "number"
                    ? item.price + product.price
                    : item.price,
              }
            : item
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    }
    console.log("Added item to cart:", product);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw Error("Must be used inside a CartProvider");
  return context;
};
