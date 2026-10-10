import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LogoutModal from "./LogoutModal";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const openLogoutModal = () => {
    setMenuOpen(false);
    setShowLogoutModal(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-blue-600 text-white px-4 py-3 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">

          {/* ================= TOP NAVBAR ================= */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="text-xl sm:text-2xl font-bold"
            >
              MyShop
            </Link>

            {/* ================= DESKTOP + TABLET NAVBAR ================= */}
            <div className="hidden md:flex items-center gap-4 lg:gap-5 text-sm lg:text-base">

              {/* Home */}
              <Link
                to="/"
                className="hover:text-gray-200"
              >
                Home
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
                      d="M2.25 3h1.386a1.5 1.5 0 0 1 1.465 1.17L5.4 6.75m0 0h13.35a1.5 1.5 0 0 1 1.465 1.83l-1.2 6a1.5 1.5 0 0 1-1.47 1.17H8.1a1.5 1.5 0 0 1-1.47-1.17L5.4 6.75Zm2.7 12.75a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm9 0a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0-2.25 0 1.125 1.125 0 0 0 2.25 0Z"
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

              {/* Orders */}
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="hover:text-gray-200"
                >
                  Orders
                </Link>
              )}

              {/* ================= AUTHENTICATED ================= */}
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
                        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1-7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                      />
                    </svg>

                    <span>
                      {user?.name?.split(" ")[0] || "Profile"}
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={openLogoutModal}
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

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-blue-700 transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                /* Close Icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                /* Hamburger Icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* ================= MOBILE NAVIGATION ================= */}
          {menuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-blue-500">
              <div className="flex flex-col gap-1 text-base">

                {/* Home */}
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-md hover:bg-blue-700"
                >
                  Home
                </Link>

                {/* Cart */}
                {isAuthenticated && (
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-blue-700"
                  >
                    <span>Cart</span>

                    {cartCount > 0 && (
                      <span className="min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Orders */}
                {isAuthenticated && (
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="px-3 py-2.5 rounded-md hover:bg-blue-700"
                  >
                    Orders
                  </Link>
                )}

                {/* ================= AUTHENTICATED ================= */}
                {isAuthenticated ? (
                  <>
                    {/* Profile */}
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-blue-700"
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
                          d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1-7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                        />
                      </svg>

                      <span>
                        {user?.name?.split(" ")[0] || "Profile"}
                      </span>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={openLogoutModal}
                      className="w-full text-left px-3 py-2.5 rounded-md bg-white text-blue-600 font-medium hover:bg-gray-100 mt-1"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login */}
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="px-3 py-2.5 rounded-md hover:bg-blue-700"
                    >
                      Login
                    </Link>

                    {/* Register */}
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="px-3 py-2.5 rounded-md bg-white text-blue-600 font-medium hover:bg-gray-100 mt-1"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Reusable Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Navbar;