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

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedOrderStatus,
    selectedPaymentStatus,
  ]);

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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      order.customer
        ?.toLowerCase()
        .includes(search) ||
      order._id
        ?.toLowerCase()
        .includes(search);

    const matchesOrderStatus =
      selectedOrderStatus === "All" ||
      order.orderStatus === selectedOrderStatus;

    const matchesPaymentStatus =
      selectedPaymentStatus === "All" ||
      order.paymentStatus === selectedPaymentStatus;

    return (
      matchesSearch &&
      matchesOrderStatus &&
      matchesPaymentStatus
    );
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  const startIndex =
    (currentPage - 1) * ordersPerPage;

  const endIndex = startIndex + ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    endIndex
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedOrderStatus("All");
    setSelectedPaymentStatus("All");
    setCurrentPage(1);
  };

  if (loading) {
  return (
    <AdminLayout>
      <div className="w-full">

        {/* Page Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>

          <div className="h-4 w-72 bg-gray-200 rounded mt-3 animate-pulse"></div>
        </div>

        {/* Mobile / Tablet Skeleton */}
        <div className="space-y-4 lg:hidden">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow p-4 animate-pulse"
            >
              {/* Order ID + Status */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>

                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>

              {/* Customer */}
              <div className="space-y-2 mb-5">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>

              {/* Products */}
              <div className="space-y-3 mb-5">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>

                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-2 mb-5">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>

              {/* Payment */}
              <div className="space-y-2 mb-5">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>

              {/* Status */}
              <div className="space-y-2 mb-5">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
              </div>

              {/* Button */}
              <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto animate-pulse">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Products",
                  "Total",
                  "Payment",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="text-left px-6 py-4"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-t">
                  {/* Order */}
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-200 rounded"></div>
                      <div className="h-3 w-28 bg-gray-200 rounded"></div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>

                  {/* Products */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>

                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-5">
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-5">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}

  return (
    <AdminLayout>
      <div className="w-full">

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Orders
          </h2>

          <p className="text-gray-500 mt-1">
            Manage customer orders and their status.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Search & Filters */}
          {orders.length > 0 && (
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-4 bg-gray-100">
           <div className="bg-white rounded-xl shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Customer name or Order ID"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Order Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>

                <select
                  value={selectedOrderStatus}
                  onChange={(e) =>
                    setSelectedOrderStatus(e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>

                <select
                  value={selectedPaymentStatus}
                  onChange={(e) =>
                    setSelectedPaymentStatus(e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Payments</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm ||
              selectedOrderStatus !== "All" ||
              selectedPaymentStatus !== "All") && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
            </div>
        )}

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">
              No orders found.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* No Filter Results */
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 mb-4">
              No orders match your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {startIndex + 1}
                </span>
                {" - "}
                <span className="font-medium text-gray-700">
                  {Math.min(
                    endIndex,
                    filteredOrders.length
                  )}
                </span>
                {" of "}
                <span className="font-medium text-gray-700">
                  {filteredOrders.length}
                </span>{" "}
                orders
              </p>

              {filteredOrders.length !== orders.length && (
                <p className="text-sm text-gray-500">
                  {orders.length} total orders
                </p>
              )}
            </div>

            {/* Mobile Orders */}
            <div className="space-y-4 lg:hidden">
              {currentOrders.map((order) => (
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

                    {/* Customer */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Customer
                      </p>

                      <p className="font-medium">
                        {order.customer}
                      </p>
                    </div>

                    {/* Products */}
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

                    {/* Total */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="font-bold text-lg">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    {/* Payment */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Payment
                      </p>

                      <p className="font-medium">
                        {order.paymentStatus}
                      </p>
                    </div>

                    {/* Status */}
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

                    {/* View Details */}
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
            <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
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
                  {currentOrders.map((order) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2 flex-wrap justify-center">

                  {/* Previous */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default Orders;