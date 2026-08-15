import AdminLayout from "../layouts/AdminLayout";

function Dashboard() {
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Products
          </h3>

          <p className="text-3xl font-bold mt-2">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Orders
          </h3>

          <p className="text-3xl font-bold mt-2">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Users
          </h3>

          <p className="text-3xl font-bold mt-2">
            0
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Dashboard;