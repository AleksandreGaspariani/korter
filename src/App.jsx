import { useEffect, useState } from 'react'
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Routes from './components/Router/Routes'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import 'mapbox-gl/dist/mapbox-gl.css'; // Import CSS here if not already
import { checkAuth } from './plugins/checkAuth'

function App() {
  const [count, setCount] = useState(0)
  const user = useSelector(state => state.auth.user)
  const location = useLocation()

  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch checkAuth action to verify and load auth state
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      {/* Header */}
      <Header />
      {/* Redirect / to /dashboard if user is authorized */}
      {location.pathname === '/' && user && <Navigate to="/dashboard" replace />}
      <Routes />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
