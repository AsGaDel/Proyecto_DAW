import React from 'react'
import ReactDOM from 'react-dom/client'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import './index.css'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

import { ToastProvider } from "./components/ToastContainer";
import { AuthProvider } from "./context/AuthContext";


enableMocking().then(() => {  
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>,
)})