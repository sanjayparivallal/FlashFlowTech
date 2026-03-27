import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fft_token')
  if (token) {
    config.headers['x-token'] = token
  }
  return config
})
// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register')
    
    if (error.response?.status === 401 && !isAuthRoute) {
      // Token is invalid/expired — clear storage and force login
      localStorage.removeItem('fft_token')
      localStorage.removeItem('fft_user')
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  }
)

export default api
