import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();

        setOrders(data.orders || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading orders...
        </p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600">
          {message}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg">
          You have no orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-5xl mx-auto">

        {/* Page Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          My Orders
        </h1>

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm p-5 sm:p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="text-sm sm:text-base font-medium text-gray-900 break-all">
                    {order._id}
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

              {/* Ordered Products */}
              <div className="py-5 space-y-4">
                {order.products.map((item) => (
                    <Link
                        key={item.product?._id}
                        to={`/orders/${order._id}`}
                        className="flex items-center gap-4 rounded-lg p-2 -m-2 hover:bg-gray-50 transition cursor-pointer"
                    >
                        <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border shrink-0"
                        />

                        <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900 text-base sm:text-lg">
                            {item.product?.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            ₹ {item.price} × {item.quantity}
                        </p>

                        <p className="text-sm font-medium text-gray-700 mt-1">
                            Subtotal: ₹ {item.price * item.quantity}
                        </p>
                        </div>
                    </Link>
                    ))}
              </div>

              {/* Order Footer */}
              <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Ordered on
                  </p>

                  <p className="text-sm font-medium text-gray-900">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500">
                    Total Amount
                  </p>

                  <p className="text-xl font-bold text-green-600">
                    ₹ {order.totalAmount}
                  </p>
                </div>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-700"
                >
                View Order Details →
            </Link>

            </div>
            ))}
            
            
        </div>

      </div>
    </div>
  );
}

export default Orders;