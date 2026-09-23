import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const updateCartState = (updatedCart) => {
    setCart(updatedCart);

    const count = updatedCart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setCartCount(count || 0);
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart(null);
      setCartCount(0);
      return;
    }

    try {
      const data = await getCart();

      updateCartState(data.cart);
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data?.message || error.message
      );

      setCart(null);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        setCart,
        updateCartState,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};