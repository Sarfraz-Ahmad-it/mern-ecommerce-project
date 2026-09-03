import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";
import { getDashboardStats } from "../services/adminService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getDashboardStats();

      setStats(data.stats);
    } catch (error) {
      console.log(
        "Failed to fetch dashboard stats:",
        error
      );

      setErrorMessage(
        "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Overview of your store.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <>
            {/* Dashboard Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">

              {/* Skeleton Card 1 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 2 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-36" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 3 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 4 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 5 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-36" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 6 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 7 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-36" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

              {/* Skeleton Card 8 */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-9 bg-gray-200 rounded w-20 mt-3" />
              </div>

            </div>
          </>
        ) : (
          <>
            {/* Main Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Total Products
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Low Stock Products
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.lowStockProducts}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Total Orders
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Pending Orders
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.pendingOrders}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Confirmed Orders
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.confirmedOrders}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Shipped Orders
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.shippedOrders}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Delivered Orders
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.deliveredOrders}
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
                <h3 className="text-gray-500 text-sm">
                  Cancelled Orders
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {stats.cancelledOrders}
                </p>
              </div>

            </div>
          </>
        )}

      </div>
    </AdminLayout>
  );
}

export default Dashboard;