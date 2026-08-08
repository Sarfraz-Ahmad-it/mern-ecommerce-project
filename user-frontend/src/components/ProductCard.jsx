import { Link } from "react-router-dom";
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-52 object-cover rounded-md"
      />

      <h2 className="text-xl font-bold mt-3">
        {product.name}
      </h2>

      <p className="text-gray-600 mt-2">
        {product.description}
      </p>

      <h3 className="text-green-600 text-lg font-semibold mt-3">
        ₹ {product.price}
      </h3>

      <p className="mt-2">
        <strong>Category:</strong> {product.category}
      </p>

      <p className="mb-4">
        <strong>Stock:</strong> {product.stock}
      </p>

        <Link to={`/products/${product._id}`} className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center">
          View Details
        </Link>
    </div>      
  );
}

export default ProductCard;