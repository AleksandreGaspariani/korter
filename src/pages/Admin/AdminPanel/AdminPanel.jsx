import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const AdminPanel = () => {
  return (
    <div>
      {/* ...your admin panel layout, sidebar, etc... */}
      <h2>Admin Panel</h2>
      {/* Nested admin routes will render here */}
        <nav>
            <ul>
                <li><Link to="categories">Manage Categories</Link></li>
                <li><Link to="developments">Manage Developments</Link></li>
                {/* Add more admin links as needed */}
            </ul>
        </nav>
      <Outlet />
    </div>
  )
}

export default AdminPanel