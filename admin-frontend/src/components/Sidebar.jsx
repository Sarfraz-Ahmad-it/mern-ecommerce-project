import { Link } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          w-64 h-screen
          bg-gray-900 text-white p-6
          transform transition-transform duration-300
          xl:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            Admin Panel
          </h2>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:text-white text-2xl xl:hidden"
          >
            ×
          </button>
        </div>

        <nav className="space-y-3">
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            Products
          </Link>

          <Link
            to="/add-product"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            Add Product
          </Link>

          <Link
            to="/orders"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            Orders
          </Link>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;