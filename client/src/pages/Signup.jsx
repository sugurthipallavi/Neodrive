import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import NeonButton from '../components/NeonButton'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await signup(form)
      navigate('/', { replace: true })
    } catch (ex) {
      const msg =
        ex?.response?.data?.error ||
        ex?.response?.data?.errors?.[0]?.msg ||
        ex?.message ||
        'Signup failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen mesh-bg pt-28">
      <Navbar />
      <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 pb-24 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl uppercase tracking-[0.35em] text-fuchsia-100 md:text-4xl">
            Sign Up
          </h1>
          <p className="mt-4 font-body text-slate-400">
            Forge your Neo identity — bcrypt-hashed credentials and JWT orbit pass.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel space-y-5 rounded-[28px] border border-fuchsia-400/25 p-10 shadow-[0_0_60px_rgba(168,85,247,0.12)]"
        >
          {['name', 'email'].map((field) => (
            <label key={field} className="block text-left capitalize">
              <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
                {field}
              </span>
              <input
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                required
                value={form[field]}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-cyan-400/45"
              />
            </label>
          ))}
          <label className="block text-left">
            <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-fuchsia-400/45"
            />
          </label>
          <label className="block text-left">
            <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
              Confirm password
            </span>
            <input
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-fuchsia-400/45"
            />
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <NeonButton type="submit" className="w-full !py-4" disabled={loading}>
            {loading ? 'Forging keys…' : 'Launch Profile'}
          </NeonButton>
          <p className="text-center font-body text-sm text-slate-400">
            Already synced?{' '}
            <Link to="/login" className="text-cyan-300 underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
