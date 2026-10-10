import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("Authentication required");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-40 mx-auto mb-8" />

          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>

            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-full" />
            </div>

            <div className="h-12 bg-gray-200 rounded-lg mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-red-600 text-sm sm:text-base">
            {message}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Profile not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-200 px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-5 sm:p-8">

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            My Profile
          </h1>

          <div className="space-y-5">

            {/* Name */}
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Name
              </p>

              <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
                {user.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Email
              </p>

              <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
                {user.email}
              </p>
            </div>

          </div>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full mt-8 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* Logout Confirmation */}
      <LogoutModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Profile;