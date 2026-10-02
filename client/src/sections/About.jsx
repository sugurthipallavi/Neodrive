import { motion } from 'framer-motion'
import NeonButton from '../components/NeonButton'

export default function About() {
  const features = ['100% Electric', 'AI Powered', 'Sustainable', 'Future Ready']

  return (
    <section id="about" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow opacity-25 [background-size:64px_64px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 md:grid-cols-2 md:items-center md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[32px] border border-cyan-500/15 shadow-neon"
        >
          <div
            className="aspect-[4/3] bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80)',
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neo-black/80 via-transparent to-fuchsia-900/35 mix-blend-soft-light" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neo-black via-neo-black/40 to-transparent" />
          <p className="absolute bottom-6 left-6 font-display text-[10px] uppercase tracking-[0.45em] text-cyan-200">
            NeoDrive HQ · Night Lattice
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 text-left"
        >
          <div>
            <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.32em] text-fuchsia-200 md:text-4xl">
              ABOUT NEODRIVE
            </h2>
            <p className="mt-6 font-body text-slate-300">
              We architect sustainable velocity — merging AI inference stacks with whisper-quiet electric
              drivetrains. Every NeoDrive chassis is a rolling observatory, sensing the city in spectral
              layers while keeping occupants suspended in calm, luxury silence.
            </p>
            <p className="mt-4 font-body text-slate-400">
              Our mission: erase compromise between planetary stewardship and hyperscale mobility.
              NeoDrive builds smart future mobility ecosystems — adaptive fleets, predictive energy grids,
              and human-centric cockpit holographics.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f}
                className="glass-panel flex items-center gap-3 rounded-xl border border-cyan-500/15 px-4 py-3 font-display text-[11px] uppercase tracking-[0.28em] text-cyan-100"
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 shadow-neon-sm" />
                {f}
              </li>
            ))}
          </ul>

          <NeonButton
            type="button"
            variant="ghost"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </NeonButton>
        </motion.div>
      </div>
    </section>
  )
}
