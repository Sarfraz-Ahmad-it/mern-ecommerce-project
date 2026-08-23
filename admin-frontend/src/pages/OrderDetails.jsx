import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import { getAdminOrderById } from "../services/adminService";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAdminOrderById(id);

      setOrder(data.order);
    } catch (error) {
      console.log("Failed to fetch order:", error);

      setErrorMessage(
        "Failed to load order details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500">
            Loading order details...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (errorMessage) {
    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {errorMessage}
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">
            Order not found.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Order Details
            </h2>

            <p className="text-sm text-gray-500 mt-1 break-all">
              Order ID: {order._id}
            </p>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Orders
          </button>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4">
              Customer Information
            </h3>

            <div>
              <p className="text-sm text-gray-500">
                Customer
              </p>

              <p className="font-medium mt-1">
                {order.customer}
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4">
              Shipping Address
            </h3>

            <p className="text-gray-700">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Products
          </h3>

          <div className="space-y-4">
            {order.products.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0"
              >
                {/* Product Image */}
                <div className="shrink-0">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-medium">
                    {item.product?.name ||
                      "Product unavailable"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    Price: ₹{item.price}
                  </p>
                </div>

                {/* Item Total */}
                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">
                    Item Total
                  </p>

                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment and Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4">
              Payment Information
            </h3>

            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-500">
                Payment Status
              </span>

              <span className="font-medium">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4">
              Order Information
            </h3>

            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-500">
                Order Status
              </span>

              <span className="font-medium">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              Total Amount
            </span>

            <span className="text-2xl font-bold">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default OrderDetails;