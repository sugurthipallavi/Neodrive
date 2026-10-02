import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '../components/NeonButton'
import api from '../api/client'

const initial = {
  vehicle_model: 'NeoDrive X',
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  location: '',
}

export default function Booking() {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState(['NeoDrive X', 'NeoDrive S', 'NeoDrive Z'])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api
      .get('/vehicles')
      .then((res) => {
        if (res.data?.length) {
          const names = res.data.map((v) => v.name)
          setVehicles(names)
          setForm((f) => ({ ...f, vehicle_model: names[0] }))
        }
      })
      .catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/bookings', form)
      setSuccess(true)
      setForm(initial)
    } catch (ex) {
      const msg =
        ex?.response?.data?.error ||
        ex?.response?.data?.errors?.[0]?.msg ||
        ex?.response?.data?.errors?.[0]?.msg ||
        'Booking failed — please verify the API server is running.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  return (
    <section id="booking" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-950/15 via-transparent to-cyan-950/20" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.35em] text-cyan-100 md:text-4xl">
            Book a Test Drive
          </h2>
          <p className="mt-4 font-body text-slate-400">
            Neo concierge routing — select your chassis, lattice time, and sovereign showroom vector.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel space-y-5 rounded-[28px] border border-cyan-400/20 p-8 shadow-[0_0_60px_rgba(168,85,247,0.08)]"
        >
          <label className="block text-left">
            <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
              Vehicle
            </span>
            <select
              name="vehicle_model"
              value={form.vehicle_model}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-cyan-400/50"
            >
              {vehicles.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          {[
            ['name', 'Name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'text'],
            ['date', 'Date', 'date'],
            ['time', 'Time', 'time'],
            ['location', 'Preferred location', 'text'],
          ].map(([name, label, type]) => (
            <label key={name} className="block text-left">
              <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-200/90">
                {label}
              </span>
              <input
                name={name}
                type={type}
                required
                value={form[name]}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-neo-black/60 px-4 py-3 font-body text-slate-100 outline-none focus:border-fuchsia-400/45"
              />
            </label>
          ))}

          <NeonButton type="submit" className="mt-4 w-full !py-4" disabled={loading}>
            {loading ? 'Transmitting…' : 'Book Now'}
          </NeonButton>
        </motion.form>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-neo-black/70 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel max-w-md rounded-[28px] border border-cyan-400/35 p-10 text-center shadow-neon"
            >
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-300 shadow-neon-sm"
                initial={{ rotate: -45, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <motion.span
                  className="text-3xl text-cyan-200"
                  initial={{ pathLength: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  ✓
                </motion.span>
              </motion.div>
              <h3 className="font-display text-xl uppercase tracking-[0.28em] text-white">
                Booking Confirmed
              </h3>
              <p className="mt-4 font-body text-slate-300">
                Orbital handshake complete — a Neo concierge will echo your routing beacon shortly.
              </p>
              <NeonButton type="button" className="mt-8" onClick={() => setSuccess(false)}>
                Close
              </NeonButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
