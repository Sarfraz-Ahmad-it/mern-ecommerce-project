import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="shadow-md p-4 hover:shadow-xl transition duration-300">

      {/* Product Image */}
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover rounded-md cursor-pointer"
        />
      </Link>

      {/* Product Name */}
      <Link to={`/products/${product._id}`}>
        <h2 className="text-xl font-bold mt-3 hover:text-blue-600 transition">
          {product.name}
        </h2>
      </Link>

      {/* Price */}
      <Link to={`/products/${product._id}`}>
        <h3 className="text-green-600 text-lg font-semibold mt-3 hover:text-green-700 transition">
          ₹ {product.price}
        </h3>
      </Link>

    </div>
  );
}

export default ProductCard;