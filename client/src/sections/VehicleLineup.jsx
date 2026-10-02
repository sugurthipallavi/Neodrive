import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NeonButton from '../components/NeonButton'
import api from '../api/client'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    n
  )
}

export default function VehicleLineup() {
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/vehicles')
      .then((res) => setVehicles(res.data))
      .catch(() => setError('Showroom data offline — demo placeholders active.'))
  }, [])

  const fallback = [
    {
      id: '1',
      name: 'NeoDrive X',
      price: 89900,
      top_speed: '210 mph',
      range: '520 mi',
      image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    },
    {
      id: '2',
      name: 'NeoDrive S',
      price: 72900,
      top_speed: '198 mph',
      range: '480 mi',
      image_url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    },
    {
      id: '3',
      name: 'NeoDrive Z',
      price: 62900,
      top_speed: '185 mph',
      range: '440 mi',
      image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    },
  ]

  const list = vehicles.length ? vehicles : fallback

  return (
    <section id="vehicles" className="relative scroll-mt-24 py-24 mesh-bg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.35em] text-white md:text-4xl">
            Vehicle Lineup
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-slate-400">
            Three luminous silhouettes — flagship velocity, grand touring poise, and urban razor agility.
          </p>
          {error && <p className="mt-4 font-body text-xs text-amber-300/90">{error}</p>}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {list.map((v, i) => (
            <motion.article
              key={v.id ?? v.slug}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -10 }}
              className="neo-reveal glass-panel group flex flex-col overflow-hidden rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
            >
              <div
                className="relative aspect-[16/11] overflow-hidden bg-neo-navy"
                style={{
                  backgroundImage: `url(${v.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neo-black via-transparent to-cyan-500/10 opacity-80 transition group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-8 text-left">
                <h3 className="font-display text-xl uppercase tracking-[0.25em] text-cyan-100">
                  {v.name}
                </h3>
                <p className="mt-4 font-display text-2xl text-white">{formatPrice(v.price)}</p>
                <div className="mt-4 flex flex-wrap gap-3 font-body text-xs uppercase tracking-widest text-slate-400">
                  <span className="rounded-full border border-white/10 px-3 py-1">{v.top_speed}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">{v.range}</span>
                </div>
                <div className="mt-8">
                  <NeonButton
                    type="button"
                    className="w-full !text-[10px]"
                    onClick={() =>
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Explore
                  </NeonButton>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
