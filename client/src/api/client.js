import axios from 'axios'

/** Axios instance — Vite proxies `/api` to Express */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('neodrive_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
