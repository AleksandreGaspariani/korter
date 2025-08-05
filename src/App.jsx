import { useState } from 'react'
import { BrowserRouter, Link, Outlet } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Routes from './components/Router/Routes'
import Header from './components/Header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      {/* Header */}
      <Header />
      <Routes />
      <Outlet />
    </BrowserRouter>
  )
}

export default App
