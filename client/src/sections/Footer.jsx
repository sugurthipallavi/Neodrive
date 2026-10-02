export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neo-black px-4 py-10 text-center">
      <p className="font-display text-[10px] uppercase tracking-[0.55em] text-slate-500">
        © {new Date().getFullYear()} NeoDrive · Quantum Mobility Labs
      </p>
      <p className="mx-auto mt-4 max-w-3xl font-body text-[11px] leading-relaxed text-slate-600">
        Showroom 3D vehicles are sourced from{' '}
        <a
          href="https://poly.pizza"
          className="text-slate-500 underline-offset-4 hover:text-cyan-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Poly Pizza
        </a>{' '}
        (CC-licensed community assets). Model credits are listed in{' '}
        <code className="rounded bg-white/5 px-1 text-cyan-700">src/config/carAssets.js</code>.
      </p>
    </footer>
  )
}
