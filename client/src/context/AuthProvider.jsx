import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const token = localStorage.getItem('neodrive_token')

    if (!token) {
      queueMicrotask(() => setLoading(false))
      return
    }

    api
      .get('/auth/me')
      .then((res) => {
        if (cancelled) return
        setUser(res.data)
      })
      .catch(() => {
        if (cancelled) return
        localStorage.removeItem('neodrive_token')
        setUser(null)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('neodrive_token', data.token)
    setUser(data.user)
    return data.user
  }

  const signup = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('neodrive_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('neodrive_token')
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, signup, logout, setUser }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

