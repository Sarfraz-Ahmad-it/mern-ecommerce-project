import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white px-4 py-3 sm:px-6 lg:px-8 shadow-lg">
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
    className="relative flex items-center hover:text-gray-200"
    aria-label={`Cart with ${cartCount} items`}
  >
    {/* Cart Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386a1.5 1.5 0 0 1 1.465 1.17L5.4 6.75m0 0h13.35a1.5 1.5 0 0 1 1.465 1.83l-1.2 6a1.5 1.5 0 0 1-1.47 1.17H8.1a1.5 1.5 0 0 1-1.47-1.17L5.4 6.75Zm2.7 12.75a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm9 0a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
      />
    </svg>

    {/* Cart Count */}
    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[11px] font-bold leading-none">
        {cartCount}
      </span>
    )}
  </Link>
)}

          {/* Authentication */}
          {isAuthenticated ? (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-1.5 hover:text-gray-200"
              >
                {/* Profile Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  />
                </svg>

                <span>
                   {user?.name?.split(" ")[0] || "Profile"}
                </span>
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