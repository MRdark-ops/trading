import axios from 'axios'

// Use the proxy when in development, full URL for production
const API_BASE = import.meta.env.DEV
  ? '/api' // In dev, use Vite proxy
  : import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

console.log('🔌 API Base URL:', API_BASE)

const api = axios.create({
  baseURL: API_BASE
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('adminUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
