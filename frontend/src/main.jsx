import React from 'react'
import ReactDOM from 'react-dom/client'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import './index.css'

import { ToastProvider } from "./components/ToastContainer";
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>,
)
