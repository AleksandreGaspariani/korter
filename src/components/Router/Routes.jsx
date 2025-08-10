import React from 'react'
import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard/Dashboard'
import Map from '../Map/Map'
import MapO from '../Map/MapO'
import MapC from '../Map/MapC'
import PropertyListings from '../../pages/PropertyListings/PropertyListings'
import DevelopersListing from '../../pages/Developers/Developers'

const Routes = () => {
  return (
    <RouterRoutes>``
      {/* Layout route */}
      <Route path="/" element={<><Outlet /></>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map" element={<MapO />} />
        <Route path="new-buildings" element={<PropertyListings />} />
        <Route path='developers' element={<DevelopersListing />} />
        {/* Add more nested routes here */}
      </Route>
    </RouterRoutes>
  )
}

export default Routes