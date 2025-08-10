import React from 'react'
import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard/Dashboard'
import Map from '../Map/Map'
import MapO from '../Map/MapO'
import MapC from '../Map/MapC'
import PropertyListings from '../../pages/PropertyListings/PropertyListings'
import DevelopersListing from '../../pages/Developers/Developers'
import MapB from '../Map/MapB'
import AdminPanel from '../../pages/Admin/AdminPanel/AdminPanel'

// Add your admin subpages here:
const AdminCategories = () => <div>Categories Management</div>
const AdminDevelopments = () => <div>Developments Management</div>
// ...add more as needed...

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Layout route */}
      <Route path="/" element={<><Outlet /></>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map" element={<MapB />} />
        <Route path="new-buildings" element={<PropertyListings />} />
        <Route path='developers' element={<DevelopersListing />} />
        {/* Admin Panel with nested routes */}
        <Route path="admin-panel" element={<AdminPanel />}>
          <Route path="categories" element={<AdminCategories />} />
          <Route path="developments" element={<AdminDevelopments />} />
          {/* Add more nested admin routes here */}
        </Route>
        {/* Add more nested routes here */}
      </Route>
    </RouterRoutes>
  )
}

export default Routes