import React, { createContext, useContext } from "react";
import useCartHook from "../hooks/useCart"; // your original cart hook

// Create a context
const CartContext = createContext(null);

// Provider component
export const CartProvider = ({ children }) => {
  const cartState = useCartHook(); // use your existing useCart hook

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
};

// Replace all imports of useCart with this
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
