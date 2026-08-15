import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  getAdminProducts,
  deleteAdminProduct,
} from "../services/adminService";

import AdminLayout from "../layouts/AdminLayout";

function Products() {
  const [products, setProducts] = useState([]);

  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  const fetchProducts = async () => {
    try {
      const data = await getAdminProducts();

      console.log("Products:", data);

      setProducts(data.products);
    } catch (error) {
      console.log("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDelete = async (id) => {
    try {
      const data = await deleteAdminProduct(id);

      console.log("Delete successful:", data);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          Products
        </h2>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-4">
                Product
              </th>

              <th className="text-left px-6 py-4">
                Category
              </th>

              <th className="text-left px-6 py-4">
                Price
              </th>

              <th className="text-left px-6 py-4">
                Stock
              </th>

              <th className="text-left px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />

                    <span className="font-medium">
                      {product.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {product.category}
                </td>

                <td className="px-6 py-4">
                  ₹{product.price}
                </td>

                <td className="px-6 py-4">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  <Link
                    to={`/edit-product/${product._id}`}
                    className="text-blue-600 mr-4"
                  >
                    Edit
                  </Link>

                 <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to delete this product?"
                      );

                      if (confirmed) {
                        handleDelete(product._id);
                      }
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No products found
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default Products;