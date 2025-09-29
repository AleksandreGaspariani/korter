import React from 'react'
import { Routes as RouterRoutes, Route, Outlet, Navigate } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard/Dashboard'
// import Map from '../Map/Map'
// import MapO from '../Map/MapO'
// import MapC from '../Map/MapC'
import MapS from '../Map/MapS'
import PropertyListings from '../../pages/PropertyListings/PropertyListings'
import DevelopersListing from '../../pages/Developers/Developers'
// import MapB from '../Map/MapB'
import AdminPanel from '../../pages/Admin/AdminPanel/AdminPanel'
import PropertyDetail from '../../pages/PropertyListings/PropertyDetail/PropertyDetail'
import SearchProperty from '../../pages/PropertyListings/SearchProperty/SearchProperty'
import Login from '../../pages/Authentication/Login'
import RequireAuth from './RequireAuth'
import AboutUs from '../../pages/About/AboutUs'
import ContactUs from '../../pages/Contact/ContactUs'
import AddProperty from '../../pages/PropertyListings/AddProperty/AddProperty'
import MyPropertyListings from '../../pages/PropertyListings/MyPropertyListings/MyPropertyListings'
import PropertyManagement from '../../pages/Admin/AdminPages/PropertyManagement'
import UsersManager from '../../pages/Admin/AdminPages/UserManagement'
import AdminDevelopments from '../../pages/Admin/AdminPages/AdminDevelopments'
import { useAuthUser } from '../../redux/useAuthUser'
import MyDevelopments from '../../pages/Developers/MyDevelopments'
import Profile from '../../pages/Profile/Profile'
import BuildingCompanies from '../../pages/Admin/AdminPages/BuildingCompanies'

const Routes = () => {
  const user = useAuthUser();

  return (
    <RouterRoutes>
      {/* Layout route */}
      {/* Remove or modify the redirect below */}
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      {/* Example: Show Dashboard only if authenticated, else show Login or Landing */}
      <Route path="/" element={user ? <Dashboard /> : <Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="map" element={<MapS />} />
      <Route path="new-buildings" element={<PropertyListings />} />
      <Route path='developers' element={<DevelopersListing />} />
      <Route path="auth" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
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

      <Route path='profile' element={
        <RequireAuth roles={['regular_user', 'admin', 'developer']}>
          <Profile />
        </RequireAuth>
      }/>

      <Route path='my/buildings' element={
        <RequireAuth roles={['developer', 'admin']}>
          <MyDevelopments />
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
        <Route path="developments" element={<AdminDevelopments />} />
        <Route path="properties" element={<PropertyManagement />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="building_companies" element={<BuildingCompanies />} />
        {/* Add more nested admin routes here */}
      </Route>

      <Route path="property/:id" element={<PropertyDetail />} />
      <Route path='/search/apartments' element={<SearchProperty />} />
      {/* Add more nested routes here */}
    </RouterRoutes>
  )
}

export default Routes