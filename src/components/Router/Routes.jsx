import React from 'react'
import { Routes as RouterRoutes, Route, Outlet, Navigate } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard/Dashboard'
import Map from '../Map/Map'
import MapO from '../Map/MapO'
import MapC from '../Map/MapC'
import MapS from '../Map/MapS'
import PropertyListings from '../../pages/PropertyListings/PropertyListings'
import DevelopersListing from '../../pages/Developers/Developers'
import MapB from '../Map/MapB'
import AdminPanel from '../../pages/Admin/AdminPanel/AdminPanel'
import PropertyDetail from '../../pages/PropertyListings/PropertyDetail/PropertyDetail'
import SearchProperty from '../../pages/PropertyListings/SearchProperty/SearchProperty'
import Login from '../../pages/Authentication/Login'
import RequireAuth from './RequireAuth'
import AboutUs from '../../pages/About/AboutUs'
import ContactUs from '../../pages/Contact/ContactUs'
import AddProperty from '../../pages/PropertyListings/AddProperty/AddProperty'
import MyPropertyListings from '../../pages/PropertyListings/MyPropertyListings/MyPropertyListings'

// Add your admin subpages here:
const AdminCategories = () => <div>Categories Management</div>
const AdminDevelopments = () => <div>Developments Management</div>
// ...add more as needed...

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Layout route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="map" element={<MapS />} />
      <Route path="new-buildings" element={<PropertyListings />} />
      <Route path='developers' element={<DevelopersListing />} />
      <Route path="auth" element={<Login />} />
      <Route path='about' element={<AboutUs />} />
      <Route path='contact' element={<ContactUs />} />
      <Route path='add-property' element={
        <RequireAuth roles={['regular_user', 'admin']}>
          <AddProperty />
        </RequireAuth>
      }/>
      <Route path='my/listings' element={
        <RequireAuth roles={['regular_user', 'admin']}>
          <MyPropertyListings />
        </RequireAuth>
      }/>
        
      {/* Admin Panel with nested routes */}
      <Route
        path="admin-panel"
        element={
          <RequireAuth roles={['admin']}>
            <AdminPanel />
          </RequireAuth>
        }
      >
        <Route path="categories" element={<AdminCategories />} />
        <Route path="developments" element={<AdminDevelopments />} />
        {/* Add more nested admin routes here */}
      </Route>

      <Route path="property/:id" element={<PropertyDetail />} />
      <Route path='/search/apartments' element={<SearchProperty />} />
      {/* Add more nested routes here */}
    </RouterRoutes>
  )
}

export default Routes