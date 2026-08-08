import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);

      setProduct(data.product);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
  <div className="max-w-6xl mx-auto p-8">
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[450px] object-cover rounded-lg shadow-lg"
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-4">
          {product.name}
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          {product.description}
        </p>

        <h2 className="text-3xl font-bold text-green-600 mb-4">
          ₹ {product.price}
        </h2>

        <p className="mb-2">
          <strong>Category:</strong> {product.category}
        </p>

        <p className="mb-6">
          <strong>Stock:</strong> {product.stock}
        </p>

        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>

          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default ProductDetails;