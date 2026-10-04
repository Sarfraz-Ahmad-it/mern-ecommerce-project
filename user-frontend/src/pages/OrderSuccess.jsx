import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">

        {/* Success Icon */}
        <div className="mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <span className="text-3xl text-green-600">
            ✓
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. Your order has been placed successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/orders"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;