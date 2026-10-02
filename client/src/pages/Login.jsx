import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import NeonButton from '../components/NeonButton'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch {
      setError('Invalid credentials — try admin@neodrive.io / admin123 for console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen mesh-bg pt-28">
      <Navbar />
      <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 pb-24 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl uppercase tracking-[0.35em] text-cyan-100 md:text-4xl">
            Login
          </h1>
          <p className="mt-4 font-body text-slate-400">
            Enter your Neo lattice credentials — JWT-secured session with encrypted transit.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel space-y-5 rounded-[28px] border border-cyan-400/25 p-10 shadow-neon"
        >
          <label className="block text-left">
            <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-fuchsia-400/45"
            />
          </label>
          <label className="block text-left">
            <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-fuchsia-400/45"
            />
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <NeonButton type="submit" className="w-full !py-4" disabled={loading}>
            {loading ? 'Authorizing…' : 'Enter Deck'}
          </NeonButton>
          <p className="text-center font-body text-sm text-slate-400">
            No beacon yet?{' '}
            <Link to="/signup" className="text-cyan-300 underline-offset-4 hover:underline">
              Create account
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
