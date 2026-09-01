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

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 15;

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
        prevProducts.filter(
          (product) => product._id !== id
        )
      );

      setSuccessMessage(
        "Product deleted successfully."
      );

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

  // Get unique categories
  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Search + Category Filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    endIndex
  );

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Products
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your products.
          </p>
        </div>

        {/* Search + Category Filter */}
        <div className="sticky top-0 z-30 bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by product name..."
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Products */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-gray-500">
                No products found.
              </p>

              {(searchTerm ||
                selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile + Tablet Cards */}
              <div className="p-4 space-y-4 lg:hidden">
                {currentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                      />

                      <div className="min-w-0">
                        <h3 className="font-semibold text-base truncate">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Price
                        </p>

                        <p className="font-semibold mt-1">
                          ₹{product.price}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Stock
                        </p>

                        <p className="font-semibold mt-1">
                          {product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          setProductToDelete(product)
                        }
                        disabled={
                          deletingId === product._id
                        }
                        className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                      >
                        {deletingId === product._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[800px]">
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
                    {currentProducts.map((product) => (
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
                            className="text-blue-600 mr-4 hover:text-blue-800"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              setProductToDelete(product)
                            }
                            disabled={
                              deletingId === product._id
                            }
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
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
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t px-4 py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      {startIndex + 1}–
                      {Math.min(
                        endIndex,
                        filteredProducts.length
                      )}{" "}
                      of {filteredProducts.length} products
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.max(prev - 1, 1)
                          )
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() =>
                            setCurrentPage(page)
                          }
                          className={`min-w-10 px-3 py-2 rounded-lg text-sm border ${
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              totalPages
                            )
                          )
                        }
                        disabled={
                          currentPage === totalPages
                        }
                        className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 sm:p-6">
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

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={
                  deletingId === productToDelete._id
                }
                className="w-full sm:w-auto px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleDelete(productToDelete._id)
                }
                disabled={
                  deletingId === productToDelete._id
                }
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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