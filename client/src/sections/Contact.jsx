import { useState } from 'react'
import { motion } from 'framer-motion'
import NeonButton from '../components/NeonButton'
import api from '../api/client'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    try {
      await api.post('/contacts', form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setErr('Could not send — check API connection.')
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 mesh-bg">
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.32em] text-cyan-100 md:text-4xl">
              Contact NeoDrive
            </h2>
            <p className="mt-6 font-body text-slate-400">
              Strategic partnerships, fleet conversions, press holographics — route your signal through the
              Neo lattice.
            </p>
            <ul className="mt-8 space-y-4 font-body text-sm text-slate-300">
              <li>
                <span className="font-display text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/90">
                  Beacon
                </span>
                <br />
                concierge@neodrive.io
              </li>
              <li>
                <span className="font-display text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/90">
                  Lattice HQ
                </span>
                <br />
                Neo Tokyo Arc · Tower VII
              </li>
            </ul>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel space-y-4 rounded-[28px] border border-white/10 p-8"
          >
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-neo-black/50 px-4 py-3 font-body text-slate-100 outline-none focus:border-cyan-400/45"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-neo-black/50 px-4 py-3 font-body text-slate-100 outline-none focus:border-cyan-400/45"
            />
            <textarea
              required
              placeholder="Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-neo-black/50 px-4 py-3 font-body text-slate-100 outline-none focus:border-fuchsia-400/45"
            />
            {err && <p className="text-sm text-rose-300">{err}</p>}
            {sent && <p className="text-sm text-cyan-300">Transmission received.</p>}
            <NeonButton type="submit" className="w-full">
              Send
            </NeonButton>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
