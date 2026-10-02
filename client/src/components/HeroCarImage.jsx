import { useMemo } from 'react'

export default function HeroCarImage({ carImageUrl, neonColor = '#22d3ee' }) {
  const url = useMemo(() => carImageUrl ?? '', [carImageUrl])

  return (
    <div className="relative h-full w-full overflow-hidden">
      

      {/* glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(192,132,252,0.18),transparent_55%)]" />

      {/* image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80'}
          alt="NeoDrive hero car"
          className="h-[85%] w-auto select-none drop-shadow-[0_0_30px_rgba(34,211,238,0.25)]"
        />
      </div>

      {/* neon rim glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[62%] h-[40%] w-[75%] -translate-x-1/2 rounded-full blur-[28px]"
        style={{ background: `radial-gradient(circle, ${neonColor}33, transparent 65%)` }}
      />

    </div>
  )
}

