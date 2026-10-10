import { useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );

      // Update AuthContext
      login(
        response.data.token,
        response.data.user
      );

      // Get redirect information
      const from = location.state?.from || "/";
      const action = location.state?.action;

      // Buy Now flow
      if (action === "buyNow") {
        const productId = from.split("/").pop();

        navigate("/checkout", {
          state: {
            source: "buyNow",
            items: [
              {
                productId,
                quantity: location.state?.quantity || 1,
              },
            ],
          },
        });
      } else {
        // Normal flow
        navigate(from);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow">

        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Login
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Login to your account to continue
          </p>
        </div>

        {/* Login Required Message */}
        {location.state?.loginRequired && (
          <div className="mb-5 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-red-700 text-center">
            {location.state?.action === "buyNow"
              ? "Please log in to continue with Buy Now."
              : "Please log in to add products to your cart."}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-red-600">
            {message}
          </p>
        )}

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={{
              from: location.state?.from || "/",
              loginRequired: location.state?.loginRequired,
              action: location.state?.action,
              quantity: location.state?.quantity,
            }}
            className="font-semibold text-black hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;