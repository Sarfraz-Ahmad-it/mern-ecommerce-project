import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="space-y-3">
        <Link
          to="/dashboard"
          className="block px-4 py-3 rounded-lg hover:bg-gray-800"
        >
          Dashboard
        </Link>

        <Link
          to="/products"
          className="block px-4 py-3 rounded-lg hover:bg-gray-800"
        >
          Products
        </Link>

        <Link
          to="/add-product"
          className="block px-4 py-3 rounded-lg hover:bg-gray-800"
        >
          Add Product
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;