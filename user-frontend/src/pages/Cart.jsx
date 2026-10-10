import { useEffect, useState } from "react";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../services/cartService";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { updateCartState } = useCart();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

  // Selected product IDs
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();

        setCart(data.cart);
        updateCartState(data.cart);

        // No products selected by default
        setSelectedItems([]);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to fetch cart"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Select / unselect one product
  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Select / unselect all products
  const handleSelectAll = () => {
    if (!cart?.items?.length) return;

    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        cart.items.map((item) => item.product?._id)
      );
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingProduct(productId);
      setMessage("");

      const data = await updateCartQuantity(productId, quantity);

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

      // Remove deleted product from selected items
      setSelectedItems((prev) =>
        prev.filter((id) => id !== productId)
      );

      // Show toast
      setToast("Item removed from cart");

      // Hide toast after 2.5 seconds
      setTimeout(() => {
        setToast("");
      }, 2500);
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

      // Clear selected items
      setSelectedItems([]);

      // Show toast
      setToast("Cart cleared");

      // Hide toast after 2.5 seconds
      setTimeout(() => {
        setToast("");
      }, 2500);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    } finally {
      setClearingCart(false);
    }
  };

  // Selected cart items
  const selectedCartItems =
    cart?.items?.filter((item) =>
      selectedItems.includes(item.product?._id)
    ) || [];

  // Total of selected products only
  const totalAmount = selectedCartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  // Total quantity of selected products
  const totalItems = selectedCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Checkout selected products
  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      setMessage("Please select at least one product");
      return;
    }

    const items = selectedCartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    navigate("/checkout", {
      state: {
        source: "cart",
        items,
      },
    });
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-6xl mx-auto animate-pulse">

        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-48 mt-2" />
          </div>

          <div className="h-10 bg-gray-200 rounded-lg w-full sm:w-28" />
        </div>

        {/* Select All Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4">

                  {/* Image Skeleton */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded mt-1 shrink-0" />

                    <div className="w-full sm:w-28 h-48 sm:h-28 bg-gray-200 rounded-lg shrink-0" />
                  </div>

                  {/* Product Info Skeleton */}
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />

                    <div className="h-5 bg-gray-200 rounded w-24" />

                    {/* Quantity Skeleton */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                      <div className="w-8 h-5 bg-gray-200 rounded" />
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                    </div>

                    <div className="h-5 bg-gray-200 rounded w-32" />

                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Desktop Summary Skeleton */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-4 bg-gray-200 rounded w-8" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-8" />
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-16" />
                  <div className="h-7 bg-gray-200 rounded w-24" />
                </div>

                <div className="h-12 bg-gray-200 rounded-lg mt-5" />
              </div>
            </div>
          </div>

        </div>

      </div>
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-600">
            Add some products to your cart.
          </p>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm">
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-sm shrink-0">
                ✓
              </span>

              <p className="text-sm sm:text-base font-medium">
                {toast}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const allSelected =
    selectedItems.length === cart.items.length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Cart
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              {selectedCartItems.length} of {cart.items.length} products selected
            </p>
          </div>

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

        {/* Error Message */}
        {message && (
          <p className="text-red-600 text-sm mb-4">
            {message}
          </p>
        )}

        {/* Select All */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />

            <span className="font-medium text-gray-900">
              Select All
            </span>

            <span className="text-sm text-gray-500">
              ({cart.items.length} products)
            </span>
          </label>
        </div>

        {/* Main Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const productId = item.product._id;

              const isUpdating =
                updatingProduct === productId;

              const isSelected =
                selectedItems.includes(productId);

              return (
                <div
                  key={productId}
                  className={`bg-white rounded-xl shadow-sm p-4 sm:p-5 transition ${
                    isSelected
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* Selection + Product Image */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleSelectItem(productId)
                        }
                        className="w-5 h-5 mt-1 accent-blue-600 cursor-pointer shrink-0"
                      />

                      {/* Clickable Product Image */}
                      <Link
                        to={`/products/${productId}`}
                        className="shrink-0"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full sm:w-28 h-48 sm:h-28 object-cover rounded-lg hover:opacity-90 transition cursor-pointer"
                        />
                      </Link>
                    </div>

                    {/* Product Information */}
                    <div className="flex-1">

                      {/* Clickable Product Name */}
                      <Link
                        to={`/products/${productId}`}
                        className="inline-block"
                      >
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition">
                          {item.product.name}
                        </h2>
                      </Link>

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
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-sm text-gray-600">
                    Selected Total
                  </p>

                  <p className="text-xl font-bold text-green-600">
                    ₹ {totalAmount}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {totalItems} item
                    {totalItems !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedCartItems.length === 0}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

              <div className="space-y-2 mb-4">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Selected Products
                  </span>

                  <span className="font-medium">
                    {selectedCartItems.length}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Total Items
                  </span>

                  <span className="font-medium">
                    {totalItems}
                  </span>
                </div>

              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-700 font-medium">
                  Total
                </span>

                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  ₹ {totalAmount}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedCartItems.length === 0}
                className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Checkout
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">

            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-sm shrink-0">
              ✓
            </span>

            <p className="text-sm sm:text-base font-medium">
              {toast}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default Cart;