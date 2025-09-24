import { Link, Outlet, useLocation } from "react-router-dom"
import { FaUsers, FaBuilding, FaHome, FaBars } from "react-icons/fa"
import { useState } from "react"

const adminLinks = [
  {
    to: "/admin-panel/users",
    label: "Manage Users",
    icon: FaUsers,
  },
  {
    to: "/admin-panel/developments",
    label: "Manage Developments",
    icon: FaBuilding,
  },
  {
    to: "/admin-panel/properties",
    label: "Manage Properties",
    icon: FaHome,
  },
  // ...add more links as needed...
]

const AdminPanel = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-100 w-64 bg-white shadow-lg border-r transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center h-20 border-b">
          <span className="text-2xl font-bold text-purple-700 tracking-wide">
            Admin Panel
          </span>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {adminLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to)
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-colors ${
                      isActive
                        ? "bg-purple-600 text-white shadow"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    <link.icon className="text-xl" />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Open sidebar"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 transition-all duration-200">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
          {/* You can add user avatar, logout, etc. here */}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[60vh]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminPanel
