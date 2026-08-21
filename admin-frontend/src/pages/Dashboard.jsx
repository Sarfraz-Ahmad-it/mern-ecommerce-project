import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getAdminProducts } from "../services/adminService";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminProducts();

        setProducts(data.products || data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalProducts = products.length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Products
          </h3>

          <p className="text-3xl font-bold mt-2">
            {loading ? "..." : totalProducts}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Out of Stock
          </h3>

          <p className="text-3xl font-bold mt-2">
            {loading ? "..." : outOfStockProducts}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Low Stock
          </h3>

          <p className="text-3xl font-bold mt-2">
            {loading ? "..." : lowStockProducts}
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Dashboard;