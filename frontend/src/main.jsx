import React from 'react'
import ReactDOM from 'react-dom/client'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import './index.css'

import { ToastProvider } from "./components/ToastContainer";


ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App />
  </ToastProvider>,
)
