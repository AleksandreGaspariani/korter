import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  } from 'react';
import './index.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
