import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    navigate("/");
  };

  return (
    <>
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 text-2xl md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <h1 className="text-lg sm:text-xl font-semibold">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-gray-600 hidden sm:block">
            Admin
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-3">
              Logout?
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() =>
                  setShowLogoutModal(false)
                }
                className="w-full sm:w-auto px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;