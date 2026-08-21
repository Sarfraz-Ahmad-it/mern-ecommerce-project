import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("adminToken");

    navigate("/login");
  };
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">
        Admin Dashboard
      </h1>

      <div className="text-gray-600">
        Admin
      </div>
      <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Logout
        </button>
    </header>
  );
}

export default Navbar;