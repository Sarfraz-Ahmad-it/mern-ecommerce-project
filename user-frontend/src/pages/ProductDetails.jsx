import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const { updateCartState } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        setProduct(data.product);
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login to add products to cart."
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await addToCart(
        product._id,
        quantity
      );

      // Update CartContext
      updateCartState(data.cart);

      setMessage(
        data.message || "Product added to cart"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">

        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 sm:h-96 md:h-[450px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 text-base sm:text-lg mb-6">
            {product.description}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
            ₹ {product.price}
          </h2>

          <p className="mb-2">
            <strong>Category:</strong>{" "}
            {product.category}
          </p>

          <p className="mb-6">
            <strong>Stock:</strong>{" "}
            {product.stock}
          </p>

          {/* Quantity */}
          <div className="mb-6">
            <p className="font-medium mb-2">
              Quantity
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.max(1, prev - 1)
                  )
                }
                className="w-10 h-10 bg-gray-200 rounded-lg text-lg font-bold hover:bg-gray-300"
              >
                -
              </button>

              <span className="w-10 text-center font-semibold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(
                      product.stock,
                      prev + 1
                    )
                  )
                }
                className="w-10 h-10 bg-gray-200 rounded-lg text-lg font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              onClick={handleAddToCart}
              disabled={
                loading ||
                product.stock === 0
              }
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Adding..."
                : "Add to Cart"}
            </button>

            <button
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Buy Now
            </button>

          </div>

          {/* Message */}
          {message && (
            <p className="mt-4 text-sm sm:text-base text-blue-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;