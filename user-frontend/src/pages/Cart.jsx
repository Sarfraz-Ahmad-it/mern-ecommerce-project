import { useEffect, useState } from "react";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../services/cartService";
import { useCart } from "../context/CartContext";

function Cart() {
  const { updateCartState } = useCart();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();

        setCart(data.cart);
        updateCartState(data.cart);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to fetch cart"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingProduct(productId);
      setMessage("");

      const data = await updateCartQuantity(
        productId,
        quantity
      );

      setCart(data.cart);
      updateCartState(data.cart);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setUpdatingProduct(productId);
      setMessage("");

      const data = await removeFromCart(productId);

      setCart(data.cart);
      updateCartState(data.cart);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearingCart(true);
      setMessage("");

      const data = await clearCart();

      setCart(data.cart);
      updateCartState(data.cart);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    } finally {
      setClearingCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">
          Loading cart...
        </p>
      </div>
    );
  }

  if (message && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600 text-center">
          {message}
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-600">
            Add some products to your cart.
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = cart.items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Cart
          </h1>

          <button
            onClick={handleClearCart}
            disabled={clearingCart}
            className="w-full sm:w-auto bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {clearingCart
              ? "Clearing..."
              : "Clear Cart"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="text-red-600 text-sm mb-4">
            {message}
          </p>
        )}

        {/* Main Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {cart.items.map((item) => {
              const productId = item.product._id;

              const isUpdating =
                updatingProduct === productId;

              return (
                <div
                  key={productId}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* Product Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full sm:w-28 h-48 sm:h-28 object-cover rounded-lg"
                    />

                    {/* Product Information */}
                    <div className="flex-1">

                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {item.product.name}
                      </h2>

                      <p className="text-gray-600 mt-1">
                        ₹ {item.product.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              productId,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            isUpdating ||
                            item.quantity <= 1
                          }
                          className="w-9 h-9 rounded-lg bg-gray-200 text-lg font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              productId,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            isUpdating ||
                            item.quantity >=
                              item.product.stock
                          }
                          className="w-9 h-9 rounded-lg bg-gray-200 text-lg font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>

                      </div>

                      {/* Subtotal */}
                      <p className="font-semibold text-gray-900 mt-3">
                        Subtotal: ₹{" "}
                        {item.product.price *
                          item.quantity}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          handleRemove(productId)
                        }
                        disabled={isUpdating}
                        className="mt-3 text-red-600 text-sm font-medium hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
    <div className="lg:col-span-1">

  {/* Mobile Summary */}
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 lg:hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">
          Total
        </p>

        <p className="text-xl font-bold text-green-600">
          ₹ {totalAmount}
        </p>
      </div>

      <button
        className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700"
      >
        Checkout
      </button>
    </div>
  </div>

  {/* Desktop Summary */}
  <div className="hidden lg:block bg-white rounded-xl shadow-sm p-5 sm:p-6 sticky top-20">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
      Order Summary
    </h2>

    <div className="flex justify-between items-center border-t pt-4">
      <span className="text-gray-700 font-medium">
        Total
      </span>

      <span className="text-xl sm:text-2xl font-bold text-green-600">
        ₹ {totalAmount}
      </span>
    </div>

    <button
      className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
    >
      Checkout
    </button>
  </div>

</div>

        </div>
      </div>
    </div>
  );
}

export default Cart;