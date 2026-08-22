import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  getAdminProducts,
  deleteAdminProduct,
} from "../services/adminService";

import AdminLayout from "../layouts/AdminLayout";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [productToDelete, setProductToDelete] = useState(null);

  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAdminProducts();

      console.log("Products:", data);

      setProducts(data.products);
    } catch (error) {
      console.log("Failed to fetch products:", error);

      setErrorMessage(
        "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
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
      setDeletingId(id);
      setErrorMessage("");

      const data = await deleteAdminProduct(id);

      console.log("Delete successful:", data);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      setSuccessMessage("Product deleted successfully.");

      setProductToDelete(null);
    } catch (error) {
      console.log("Delete failed:", error);

      setErrorMessage(
        "Failed to delete product. Please try again."
      );
    } finally {
      setDeletingId(null);
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

      {errorMessage && (
        <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No products found
          </p>
        ) : (
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
                      onClick={() => setProductToDelete(product)}
                      disabled={deletingId === product._id}
                      className="text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {deletingId === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-3">
              Delete Product?
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {productToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={deletingId === productToDelete._id}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleDelete(productToDelete._id)
                }
                disabled={deletingId === productToDelete._id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === productToDelete._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Products;