import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'


// -- CACHE CLEANUP --
// If we are in dev/preview mode, remove any existing Service Worker
if (import.meta.env.VITE_ENVIRONMENT === 'dev' || window.location.hostname === 'localhost') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
        console.log('Service Worker Unregistered (Dev Mode Fix)');
      }
    });
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
