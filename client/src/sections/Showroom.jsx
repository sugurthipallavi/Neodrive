import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import NeonButton from '../components/NeonButton'
import ShowroomScene from '../components/three/ShowroomScene'
import ShowroomThumb from '../components/three/ShowroomThumb'
import { POLY_CARS } from '../config/carAssets'



const MODELS = {
  x: {
    id: 'x',
    label: 'NeoDrive X',
    neon: '#22d3ee',
    interior: '#38bdf8',
    poly: POLY_CARS.x,
    stats: [
      { k: 'Top Speed', v: '210 mph' },
      { k: 'Battery Range', v: '520 mi' },
      { k: 'AI Autopilot', v: 'Neural L5-ready' },
      { k: 'Fast Charging', v: '10→80% · 16 min' },
      { k: 'Torque', v: '920 lb-ft' },
      { k: 'Horsepower', v: '780 hp' },
    ],
  },
  s: {
    id: 's',
    label: 'NeoDrive S',
    neon: '#c084fc',
    interior: '#e879f9',
    poly: POLY_CARS.s,
    stats: [
      { k: 'Top Speed', v: '198 mph' },
      { k: 'Battery Range', v: '480 mi' },
      { k: 'AI Autopilot', v: 'Quantum Convoy' },
      { k: 'Fast Charging', v: '10→80% · 18 min' },
      { k: 'Torque', v: '780 lb-ft' },
      { k: 'Horsepower', v: '620 hp' },
    ],
  },
  z: {
    id: 'z',
    label: 'NeoDrive Z',
    neon: '#fb7185',
    interior: '#f472b6',
    poly: POLY_CARS.z,
    stats: [
      { k: 'Top Speed', v: '185 mph' },
      { k: 'Battery Range', v: '440 mi' },
      { k: 'AI Autopilot', v: 'Urban Ghost Mode' },
      { k: 'Fast Charging', v: '10→80% · 20 min' },
      { k: 'Torque', v: '680 lb-ft' },
      { k: 'Horsepower', v: '540 hp' },
    ],
  },
}


export default function Showroom() {
  const [modelKey, setModelKey] = useState('x')
  const [spin, setSpin] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const [viewMode, setViewMode] = useState('exterior')

  const model = MODELS[modelKey]

  return (
    <section id="showroom" className="relative scroll-mt-24 py-24 mesh-bg">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow opacity-40 [background-size:56px_56px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.35em] text-cyan-200 md:text-4xl">
            Our Showroom
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-slate-400">
            Orbital lighting. Zero-latency controls. Configure perspective like a holographic bay.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:items-start">
          <div className="flex flex-col gap-4">
            {model.stats.map((s, i) => (
              <GlassCard key={s.k} delay={i * 0.05} className="!p-4">
                <p className="font-display text-[9px] uppercase tracking-[0.28em] text-cyan-300/80">{s.k}</p>
                <p className="mt-2 font-body text-lg font-medium text-white">{s.v}</p>
              </GlassCard>
            ))}
          </div>

          <div className="relative">
            <div className="relative h-[380px] overflow-hidden rounded-[32px] border border-fuchsia-500/15 bg-neo-navy/60 shadow-neon sm:h-[460px] lg:h-[520px]">
              <Canvas key={modelKey} shadows camera={{ position: [6.5, 2.8, 8.2], fov: 42 }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                  <ShowroomScene
                    spin={spin}
                    neonColor={model.neon}
                    carGlb={model.poly.glb}
                    carScale={model.poly.scale}
                    zoomed={zoomed}
                    viewMode={viewMode}
                  />
                </Suspense>
              </Canvas>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neo-black/80 to-transparent" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {Object.values(MODELS).map((m) => (
                <motion.button
                  key={m.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModelKey(m.id)}
                  className={`glass-panel rounded-2xl border p-3 text-left transition ${
                    modelKey === m.id
                      ? 'border-cyan-400/60 shadow-neon-sm'
                      : 'border-white/10 hover:border-cyan-400/35'
                  }`}
                >
                  <div className="mb-3 aspect-video rounded-xl overflow-hidden shadow-inner">
                    <ShowroomThumb glbUrl={m.poly.glb} scale={m.poly.scale} neonColor={m.neon} />
                  </div>
                  <p className="font-display text-[10px] uppercase tracking-[0.23em] text-slate-300">
                    {m.label}
                  </p>

                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-28">
            <GlassCard className="space-y-4">
              <p className="font-display text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/90">Control Deck</p>
              <div className="flex flex-col gap-3">
                <NeonButton
                  type="button"
                  variant={spin ? 'primary' : 'ghost'}
                  className="w-full !text-[10px]"
                  onClick={() => setSpin((s) => !s)}
                >
                  {spin ? 'Pause Rotate' : 'Rotate'}
                </NeonButton>
                <NeonButton
                  type="button"
                  variant={zoomed ? 'primary' : 'ghost'}
                  className="w-full !text-[10px]"
                  onClick={() => setZoomed((z) => !z)}
                >
                  {zoomed ? 'Zoom Out' : 'Zoom'}
                </NeonButton>
                <NeonButton
                  type="button"
                  variant={viewMode === 'interior' ? 'primary' : 'ghost'}
                  className="w-full !text-[10px]"
                  onClick={() => setViewMode('interior')}
                >
                  Interior View
                </NeonButton>
                <NeonButton
                  type="button"
                  variant="ghost"
                  className="w-full !text-[10px]"
                  onClick={() => setViewMode('exterior')}
                >
                  Exterior View
                </NeonButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}

