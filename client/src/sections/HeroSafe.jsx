import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import NeonButton from '../components/NeonButton'
import ScrollIndicator from '../components/ScrollIndicator'
import HeroCyberScene from '../components/three/HeroCyberScene'
import { HERO_CAR } from '../config/carAssets'



export default function HeroSafe({ tint }) {
  const book = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  const vehicles = () => document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative min-h-screen mesh-bg pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-90" />

      <div className="relative z-10 mx-auto grid max-w-7xl flex-1 gap-10 px-4 pb-24 md:grid-cols-2 md:items-center md:px-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="text-left"
        >
          <p className="mb-4 font-display text-[10px] uppercase tracking-[0.55em] text-cyan-300/90 md:text-xs">
            NeoDrive Quantum Series
          </p>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white neon-text sm:text-5xl lg:text-6xl">
            Drive Beyond Tomorrow
          </h1>
          <p className="mt-6 max-w-md font-body text-lg text-slate-300/90 lg:text-xl">
            Next Generation AI-Powered Electric Vehicles
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <NeonButton type="button" onClick={vehicles}>
              Explore Vehicles
            </NeonButton>
            <NeonButton type="button" variant="ghost" onClick={book}>
              Book Test Drive
            </NeonButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-cyan-500/15 bg-neo-navy/40 shadow-[inset_0_0_80px_rgba(168,85,247,0.08)] sm:h-[500px] lg:h-[min(78vh,700px)]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          <Canvas
            className="absolute inset-0 h-full w-full touch-none"
            shadows
            camera={{ position: [6.5, 2.5, 8.4], fov: 42 }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <HeroCyberScene neonColor={tint?.neon ?? '#22d3ee'} heroAsset={HERO_CAR} />
            </Suspense>
          </Canvas>
          <div className="pointer-events-none absolute -right-12 top-1/4 h-48 w-48 rounded-full bg-cyan-400/25 blur-[80px]" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-[72px]" />
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  )
}

