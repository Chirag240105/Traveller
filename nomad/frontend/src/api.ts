import axios from 'axios'

// In production (Netlify), VITE_API_URL must point to your Render backend.
// In local dev, the Vite proxy handles /api → localhost:5000.
const baseURL = import.meta.env.VITE_API_URL
  ?? (import.meta.env.PROD
    ? 'https://traveller-cg86.onrender.com/api'  // fallback for production
    : '/api')                                      // local dev uses Vite proxy

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60s timeout to handle Render cold starts
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travellerToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
