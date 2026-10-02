import { motion } from 'framer-motion'
import {
  BatteryCharging,
  Bot,
  CircleParking,
  Mic,
  Radar,
  Zap,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'

const FEATURES = [
  {
    title: 'AI Autopilot',
    desc: 'Neural horizon mapping with predictive lane synth and guardian swarm redundancy.',
    Icon: Bot,
  },
  {
    title: 'Smart Battery',
    desc: 'Solid-state inspired thermal mesh — adaptive cooling with fleet-learned efficiency curves.',
    Icon: BatteryCharging,
  },
  {
    title: 'Voice Control',
    desc: 'Omni-cabin directive core — whisper-quiet NLP tuned for velocity and noise floors.',
    Icon: Mic,
  },
  {
    title: 'Self Parking',
    desc: 'Ghost valet vectors navigate ultra-tight arcologies while you step into the neon dusk.',
    Icon: CircleParking,
  },
  {
    title: '360 Sensors',
    desc: 'LiDAR fusion halo + quantum radar bloom for silhouette-perfect spatial cognition.',
    Icon: Radar,
  },
  {
    title: 'Ultra Fast Charging',
    desc: 'Hypercoupler stacks pull megawatt pulses — coffee-break replenishment, race-ready torque.',
    Icon: Zap,
  },
]

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 mesh-bg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-950/25 via-transparent to-fuchsia-950/15" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.35em] text-cyan-200 md:text-4xl">
            Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-slate-400">
            Six luminous pillars — hardware choreography tuned for zero-lag autonomy and cinematic comfort.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, desc, Icon }, i) => (
            <GlassCard
              key={title}
              delay={i * 0.06}
              whileHover={{ y: -6, boxShadow: '0 0 32px rgba(34,211,238,0.25)' }}
              className="group relative overflow-hidden border-cyan-500/20 !p-8"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-fuchsia-500/15" />
              <Icon className="mb-5 h-10 w-10 text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.65)]" />
              <h3 className="font-display text-lg uppercase tracking-[0.22em] text-white">{title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-slate-400">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
