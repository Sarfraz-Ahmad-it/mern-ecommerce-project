import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold"
        >
          MyShop
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base">

          {/* Home */}
          <Link
            to="/"
            className="hover:text-gray-200"
          >
            Home
          </Link>

          {/* Products */}
          <Link
            to="/"
            className="hover:text-gray-200"
          >
            Products
          </Link>

          {/* Cart */}
          {isAuthenticated && (
            <Link
              to="/cart"
              className="hover:text-gray-200"
            >
              Cart ({cartCount})
            </Link>
          )}

          {/* Authentication */}
          {isAuthenticated ? (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="hover:text-gray-200"
              >
                Profile
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1.5 rounded-md font-medium hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="hover:text-gray-200"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="bg-white text-blue-600 px-3 py-1.5 rounded-md font-medium hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;