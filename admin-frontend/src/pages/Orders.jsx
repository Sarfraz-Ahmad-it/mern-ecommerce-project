import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../services/adminService";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAdminOrders();

      setOrders(data.orders);
    } catch (error) {
      console.log("Failed to fetch orders:", error);

      setErrorMessage(
        "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      setErrorMessage("");

      const data = await updateAdminOrderStatus(
        orderId,
        status
      );

      console.log(
        "Order status updated successfully:",
        data
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: status,
              }
            : order
        )
      );
    } catch (error) {
      console.log(
        "Failed to update order status:",
        error
      );

      setErrorMessage(
        "Failed to update order status. Please try again."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500">
            Loading orders...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Orders
          </h2>

          <p className="text-gray-500 mt-1">
            Manage customer orders and their status.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">
              No orders found.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Orders */}
            <div className="space-y-4 md:hidden">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow p-4"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Order ID
                      </p>

                      <p className="font-medium text-sm break-all">
                        {order._id}
                      </p>
                    </div>

                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Customer
                      </p>

                      <p className="font-medium">
                        {order.customer}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Products
                      </p>

                      <div className="space-y-3 mt-2">
                        {order.products.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-3"
                          >
                            {item.product?.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 shrink-0">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {item.product?.name ||
                                  "Product unavailable"}
                              </p>

                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ₹
                                {item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="font-bold text-lg">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment
                      </p>

                      <p className="font-medium">
                        {order.paymentStatus}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        Order Status
                      </label>

                      <select
                        value={order.orderStatus}
                        disabled={
                          updatingOrderId === order._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>

                      {updatingOrderId === order._id && (
                        <p className="text-xs text-gray-500 mt-2">
                          Updating status...
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/orders/${order._id}`)
                      }
                      className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Orders */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4">
                      Order
                    </th>

                    <th className="text-left px-6 py-4">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4">
                      Products
                    </th>

                    <th className="text-left px-6 py-4">
                      Total
                    </th>

                    <th className="text-left px-6 py-4">
                      Payment
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                    <th className="text-left px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium break-all max-w-[180px]">
                          {order._id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {order.customer}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {order.products.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-3"
                            >
                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                  N/A
                                </div>
                              )}

                              <div>
                                <p className="font-medium text-sm">
                                  {item.product?.name ||
                                    "Product unavailable"}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ₹{order.totalAmount}
                      </td>

                      <td className="px-6 py-4">
                        {order.paymentStatus}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          disabled={
                            updatingOrderId === order._id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>

                        {updatingOrderId === order._id && (
                          <p className="text-xs text-gray-500 mt-2">
                            Updating...
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/orders/${order._id}`)
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default Orders;