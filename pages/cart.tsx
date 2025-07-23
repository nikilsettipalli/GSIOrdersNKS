import React, { useState } from "react";
import { useCart } from "../src/context/CartContext";
import Cart from "../src/components/Cart";
import { supabase } from "@/lib/supabaseClient";

const CartPage = () => {
  const { cart, isLoading, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Failed to clear cart:", error);
        alert("Failed to clear cart. Please try again.");
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Step 1: Get authenticated user ID
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      const userId = session?.user?.id;

      if (!userId || error) {
        console.error("User not authenticated or session error:", error);
        alert("You must be logged in to checkout.");
        setIsCheckingOut(false);
        return;
      }

      // Step 2: Prepare cart items
      const cartItems = cart.items.map((item) => ({
        name: item.products.name,
        price: item.products.price,
        quantity: item.quantity,
        product_id: item.product_id,
      }));

      // Step 3: Call your backend API to create Stripe session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cartItems,
          userId: userId,
        }),
      });

      const data = await response.json();
      const sessionId = data.sessionId;
      const checkoutUrl = data.url;

      if (!sessionId || !checkoutUrl) {
        throw new Error("No session ID or URL received from backend.");
      }

      // Step 4: Save cart snapshot to Supabase
      const { error: insertError } = await supabase.from("checkout_sessions").insert([
        {
          user_id: userId,
          stripe_session_id: sessionId,
          cart: cartItems,
        },
      ]);

      if (insertError) {
        console.error("❌ Failed to insert cart snapshot:", insertError.message);
        alert("Error saving cart before checkout.");
        return;
      }

      // Step 5: Redirect to Stripe
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-xl text-gray-600">Loading cart...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Cart
      items={cart.items || []}
      itemCount={cart.itemCount || 0}
      total={cart.total || 0}
      isLoading={isLoading}
      isCheckingOut={isCheckingOut}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onClearCart={handleClearCart}
      onCheckout={handleCheckout}
    />
  );
};

export default CartPage;
