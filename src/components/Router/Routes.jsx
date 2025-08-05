import React from 'react'
import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard/Dashboard'
import Map from '../Map/Map'
import MapO from '../Map/MapO'
import MapC from '../Map/MapC'

const Routes = () => {
  return (
    <RouterRoutes>``
      {/* Layout route */}
      <Route path="/" element={<><Outlet /></>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map" element={<MapC />} />
        {/* Add more nested routes here */}
      </Route>
    </RouterRoutes>
  )
}

export default Routes