import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getOrderById,
  cancelOrder,
} from "../services/orderService";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");
  const [showCancelModal, setShowCancelModal] =
    useState(false);

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setMessage("");
      setOrder(null);

      const data = await getOrderById(id);

      if (!data.order) {
        setMessage("Order not found");
        return;
      }

      setOrder(data.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to fetch order"
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      setMessage("");

      const data = await cancelOrder(id);

      setOrder(data.order);
      setShowCancelModal(false);
      setMessage("Order cancelled successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

 if (loading) {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>

              <div className="h-8 bg-gray-200 rounded-full w-28" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-32" />
              </div>

              <div>
                <div className="h-3 bg-gray-200 rounded w-28 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-24" />
              </div>

              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-36" />
              </div>

              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-28 mb-5" />

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0" />

                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>

                  <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-5" />

            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-5" />

            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>

              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>

              <div className="border-t pt-4 flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  if (!order) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-red-600 text-lg font-medium">
          {message || "Order not found"}
        </p>

        <Link
          to="/orders"
          className="inline-block mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Back to My Orders
        </Link>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link
          to="/orders"
          className="inline-block mb-5 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to My Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Order Details
              </h1>

              <p className="text-sm text-gray-500 mt-2 break-all">
                Order ID: {order._id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                {order.orderStatus}
              </span>

              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                Payment: {order.paymentStatus}
              </span>
            </div>

          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
            <p
              className={
                order.orderStatus === "Cancelled"
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Products */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
              Ordered Products
            </h2>

            <div className="space-y-5">
              {order.products.map((item) => (
                <div
                  key={item.product?._id}
                  className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border shrink-0"
                  />

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                      {item.product?.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Price: ₹ {item.price}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Subtotal: ₹{" "}
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 h-fit">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm sm:text-base">

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Total Items
                </span>

                <span className="font-medium">
                  {order.products.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t pt-3">
                <span className="text-gray-700 font-medium">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-green-600">
                  ₹ {order.totalAmount}
                </span>
              </div>

            </div>

            {/* Cancel Order */}
            {(order.orderStatus === "Pending" ||
              order.orderStatus === "Confirmed") && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Cancel Order
              </button>
            )}

          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mt-5">

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
            Shipping Address
          </h2>

          <div className="space-y-2 text-gray-700">

            <p>
              <span className="font-medium">
                Name:
              </span>{" "}
              {order.shippingAddress.name}
            </p>

            <p>
              <span className="font-medium">
                Phone:
              </span>{" "}
              {order.shippingAddress.phone}
            </p>

            <p>
              <span className="font-medium">
                Address:
              </span>{" "}
              {order.shippingAddress.address}
            </p>

            <p>
              <span className="font-medium">
                City:
              </span>{" "}
              {order.shippingAddress.city}
            </p>

            <p>
              <span className="font-medium">
                State:
              </span>{" "}
              {order.shippingAddress.state}
            </p>

            <p>
              <span className="font-medium">
                Pincode:
              </span>{" "}
              {order.shippingAddress.pincode}
            </p>

          </div>
        </div>

        {/* Order Date */}
        <div className="text-sm text-gray-500 mt-5">
          Ordered on{" "}
          {new Date(order.createdAt).toLocaleString()}
        </div>

      </div>

      {/* Custom Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Cancel Order?
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">

              <button
                onClick={() =>
                  setShowCancelModal(false)
                }
                disabled={cancelling}
                className="w-full sm:w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                No, Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="w-full sm:w-1/2 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;