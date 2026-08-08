import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();

      setProducts(data.products);
    };

    fetchProducts();
  }, []);

  return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold text-center mb-8">
      Welcome to My E-Commerce Website
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  </div>
);
}

export default Home;