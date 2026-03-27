import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('fft_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore user from localStorage on refresh
    const storedUser = localStorage.getItem('fft_user')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('fft_token', authToken)
    localStorage.setItem('fft_user', JSON.stringify(userData))
  }

  const logout = async () => {
    // Invalidate token server-side
    if (token) {
      try { await api.post('/auth/logout', { token }) } catch {}
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('fft_token')
    localStorage.removeItem('fft_user')
  }

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('fft_user', JSON.stringify(updated))
      return updated
    })
  }

  const isAuthenticated = !!token

  return (
    <UserContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
