import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import {
  getAdminProductById,
  updateAdminProduct,
} from "../services/adminService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAdminProductById(id);

      setProduct({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
        category: data.product.category,
        image: data.product.image,
      });
    } catch (error) {
      console.log("Failed to fetch product:", error);

      setErrorMessage(
        "Failed to load product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const validateProduct = () => {
    if (!product.name.trim()) {
      return "Product name is required.";
    }

    if (!product.description.trim()) {
      return "Description is required.";
    }

    if (product.price === "") {
      return "Price is required.";
    }

    if (Number(product.price) <= 0) {
      return "Price must be greater than 0.";
    }

    if (product.stock === "") {
      return "Stock is required.";
    }

    if (Number(product.stock) < 0) {
      return "Stock cannot be negative.";
    }

    if (!product.category.trim()) {
      return "Category is required.";
    }

    if (!product.image.trim()) {
      return "Image URL is required.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateProduct();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setUpdating(true);
      setErrorMessage("");

      const data = await updateAdminProduct(id, {
        name: product.name.trim(),
        description: product.description.trim(),
        price: Number(product.price),
        stock: Number(product.stock),
        category: product.category.trim(),
        image: product.image.trim(),
      });

      console.log("Product updated successfully:", data);

      navigate("/products", {
        state: {
          message: "Product updated successfully!",
        },
      });
    } catch (error) {
      console.log("Failed to update product:", error);

      setErrorMessage(
        "Failed to update product. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-500">
          Loading product...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">
          Edit Product
        </h2>

        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0"
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditProduct;