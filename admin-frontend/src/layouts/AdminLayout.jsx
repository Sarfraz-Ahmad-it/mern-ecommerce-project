import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="md:ml-64">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;