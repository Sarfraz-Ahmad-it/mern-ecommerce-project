import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { getCart } from "../services/cartService";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCartState } = useCart();

  const checkoutData = location.state;

  const source = checkoutData?.source;
  const selectedItems = checkoutData?.items || [];

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /*
    ------------------------------------------------
    FETCH CHECKOUT ITEMS
    ------------------------------------------------
  */

  useEffect(() => {
    const fetchCheckoutItems = async () => {
      try {
        setCartLoading(true);
        setMessage("");

        // ------------------------------------------
        // CART CHECKOUT
        // ------------------------------------------

        if (source === "cart") {
          if (!selectedItems.length) {
            setMessage("No products selected for checkout");
            setCartLoading(false);
            return;
          }

          const data = await getCart();

          const currentCart = data.cart;

          const itemsForCheckout = selectedItems
            .map((selectedItem) => {
              const cartItem = currentCart?.items?.find(
                (item) =>
                  item.product?._id === selectedItem.productId
              );

              if (!cartItem) {
                return null;
              }

              return {
                product: cartItem.product,
                quantity: selectedItem.quantity,
              };
            })
            .filter(Boolean);

          if (itemsForCheckout.length === 0) {
            setMessage(
              "Selected products are no longer available in your cart"
            );
            setCartLoading(false);
            return;
          }

          setCheckoutItems(itemsForCheckout);
        }

        // ------------------------------------------
        // BUY NOW
        // ------------------------------------------

        else if (source === "buyNow") {
          if (!selectedItems.length) {
            setMessage("No product selected");
            setCartLoading(false);
            return;
          }

          const itemsForCheckout = [];

          for (const item of selectedItems) {
            const data = await getProductById(item.productId);

            if (!data?.product) {
              continue;
            }

            itemsForCheckout.push({
              product: data.product,
              quantity: item.quantity,
            });
          }

          if (itemsForCheckout.length === 0) {
            setMessage("Product not found");
            setCartLoading(false);
            return;
          }

          setCheckoutItems(itemsForCheckout);
        }

        // ------------------------------------------
        // INVALID / DIRECT CHECKOUT
        // ------------------------------------------

        else {
          setMessage(
            "Invalid checkout session. Please go back and try again."
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load checkout items"
        );
      } finally {
        setCartLoading(false);
      }
    };

    fetchCheckoutItems();
  }, [source, selectedItems]);

  /*
    ------------------------------------------------
    HANDLE FORM
    ------------------------------------------------
  */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*
    ------------------------------------------------
    TOTAL
    ------------------------------------------------
  */

  const totalAmount = checkoutItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const totalItems = checkoutItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /*
    ------------------------------------------------
    PLACE ORDER
    ------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkoutItems.length) {
      setMessage("No products available for checkout");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const items = checkoutItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const response = await createOrder({
        items,
        shippingAddress: formData,
        source,
      });

      /*
        If the order came from the cart,
        update the CartContext with the
        remaining cart returned by backend.
      */

      if (source === "cart" && response?.cart) {
        updateCartState(response.cart);
      }

      navigate("/order-success");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    ------------------------------------------------
    LOADING
    ------------------------------------------------
  */

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading checkout...
        </p>
      </div>
    );
  }

  /*
    ------------------------------------------------
    ERROR / NO ITEMS
    ------------------------------------------------
  */

  if (!checkoutItems.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            {message || "No products available for checkout."}
          </p>

          <button
            onClick={() => navigate("/cart")}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  /*
    ------------------------------------------------
    CHECKOUT PAGE
    ------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {source === "buyNow"
              ? "Buy Now"
              : `${checkoutItems.length} selected product${
                  checkoutItems.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {/* Error Message */}
        {message && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Shipping Address */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-5 sm:p-8">

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Shipping Address
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter your complete address"
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state"
                  />
                </div>

              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pincode"
                />
              </div>

              {/* Mobile Place Order */}
              <button
                type="submit"
                disabled={loading}
                className="w-full lg:hidden bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 lg:sticky lg:top-20">

              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                Order Summary
              </h2>

              {/* Products */}
              <div className="space-y-4">

                {checkoutItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shrink-0"
                    />

                    <div className="min-w-0 flex-1">

                      <h3 className="text-sm sm:text-base font-medium text-gray-900">
                        {item.product.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        ₹ {item.product.price} ×{" "}
                        {item.quantity}
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        ₹{" "}
                        {item.product.price *
                          item.quantity}
                      </p>

                    </div>
                  </div>
                ))}

              </div>

              {/* Summary */}
              <div className="border-t mt-5 pt-5 space-y-3">

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Total Items
                  </span>

                  <span className="font-medium">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-semibold">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-green-600">
                    ₹ {totalAmount}
                  </span>
                </div>

              </div>

              {/* Desktop Place Order */}
              <button
                onClick={() =>
                  document
                    .querySelector("form")
                    ?.requestSubmit()
                }
                disabled={loading}
                className="hidden lg:block w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;