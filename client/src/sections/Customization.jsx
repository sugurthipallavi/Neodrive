import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import NeonButton from '../components/NeonButton'
import CustomizationCarCanvas from '../components/three/CustomizationCarCanvas'

const PRESETS = [
  { name: 'Ion Blue', body: '#0b1220', neon: '#38bdf8', interior: '#22d3ee', wheel: '#0b0f14' },
  { name: 'Plasma Violet', body: '#16061f', neon: '#c084fc', interior: '#e879f9', wheel: '#120822' },
  { name: 'Crimson Flux', body: '#1a0508', neon: '#fb7185', interior: '#fda4af', wheel: '#140306' },
  { name: 'Stealth Onyx', body: '#050608', neon: '#64748b', interior: '#94a3b8', wheel: '#020617' },
  { name: 'Arctic White', body: '#e2e8f0', neon: '#22d3ee', interior: '#a855f7', wheel: '#0f172a' },
]

const WHEELS = [
  { id: 'nova', label: 'Nova Aero', dark: '#070a10' },
  { id: 'pulse', label: 'Pulse Carbon', dark: '#111827' },
  { id: 'axiom', label: 'Axiom Graphite', dark: '#1f2937' },
]

export default function Customization({ onApplyTheme }) {
  const [presetIdx, setPresetIdx] = useState(0)
  const [wheelId, setWheelId] = useState('nova')
  const [neon, setNeon] = useState(PRESETS[0].neon)
  const [tint, setTint] = useState(0.38)
  const [interiorLux, setInteriorLux] = useState(1)
  const [savedFlash, setSavedFlash] = useState(false)

  const preset = PRESETS[presetIdx]
  const selectedWheel = useMemo(() => WHEELS.find((w) => w.id === wheelId) ?? WHEELS[0], [wheelId])
  const interiorColor = useMemo(() => preset.interior, [preset])


  const pickPreset = (i) => {
    setPresetIdx(i)
    setNeon(PRESETS[i].neon)
    onApplyTheme?.({
      body: PRESETS[i].body,
      neon: PRESETS[i].neon,
      cabin: 0.28 + tint * 0.6,
      interior: PRESETS[i].interior,
    })
  }

  const save = () => {
    onApplyTheme?.({
      body: preset.body,
      neon,
      cabin: 0.28 + tint * 0.6,
      interior: interiorColor,
    })
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2200)
  }

  return (
    <section id="customize" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-950/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.35em] text-fuchsia-200 md:text-4xl">
            Customize Your Ride
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-slate-400">
            Live GLB preview powered by Poly Pizza models — neon wash and cabin lighting react instantly.
            Swap `.glb` links in the car assets config to try other vehicles from{' '}
            <a
              href="https://poly.pizza/search/car"
              className="text-cyan-400 underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              poly.pizza
            </a>
            .
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative h-[min(72vh,640px)] min-h-[420px] overflow-hidden rounded-[32px] border border-cyan-500/15 bg-neo-navy/50 shadow-[0_0_80px_rgba(0,212,255,0.06)] sm:min-h-[480px] lg:min-h-[560px]">
            <CustomizationCarCanvas
              neonColor={neon}
              interiorLight={interiorColor}
              interiorIntensity={1.2 + interiorLux * 1.4}
              bodyColor={preset.body}
              windowTint={tint}
              wheelColor={selectedWheel.dark}
            />
            <AnimatePresence>
              {savedFlash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neo-black/55 backdrop-blur-sm"
                >
                  <span className="rounded-full border border-cyan-400/40 px-6 py-3 font-display text-xs uppercase tracking-[0.35em] text-cyan-100 shadow-neon-sm">
                    Configuration synced to hero preview
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <GlassCard className="space-y-8">
            <div>
              <p className="mb-3 font-display text-[10px] uppercase tracking-[0.35em] text-cyan-300/90">
                Car color
              </p>
              <div className="flex flex-wrap gap-3">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => pickPreset(i)}
                    className={`group relative h-11 w-11 rounded-full border-2 transition ${
                      presetIdx === i
                        ? 'border-white shadow-neon-sm'
                        : 'border-transparent hover:border-cyan-400/40'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${p.body}, ${p.neon})` }}
                    title={p.name}
                  >
                    <span className="sr-only">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-display text-[10px] uppercase tracking-[0.35em] text-cyan-300/90">
                Wheels
              </p>
              <div className="flex flex-wrap gap-2">
                {WHEELS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWheelId(w.id)}
                    className={`rounded-full px-4 py-2 font-body text-xs uppercase tracking-widest transition ${
                      wheelId === w.id
                        ? 'bg-gradient-to-r from-cyan-400/30 to-fuchsia-500/30 text-white border border-cyan-400/40'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/35'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-display text-[10px] uppercase tracking-[0.35em] text-cyan-300/90">
                Neon glow color
              </p>
              <input
                type="color"
                value={neon}
                onChange={(e) => setNeon(e.target.value)}
                className="h-12 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between font-body text-xs text-slate-400">
                <span>Window tint</span>
                <span>{Math.round(tint * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.15}
                max={0.85}
                step={0.01}
                value={tint}
                onChange={(e) => setTint(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between font-body text-xs text-slate-400">
                <span>Interior lighting</span>
                <span>{interiorLux.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={interiorLux}
                onChange={(e) => setInteriorLux(Number(e.target.value))}
                className="w-full accent-fuchsia-400"
              />
            </div>

            <NeonButton type="button" className="w-full" onClick={save}>
              Save &amp; View
            </NeonButton>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
