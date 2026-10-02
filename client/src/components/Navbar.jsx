import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NeonButton from './NeonButton'
import { useAuth } from '../context/AuthContext'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#vehicles', label: 'Vehicles' },
  { href: '#features', label: 'Features' },
  { href: '#showroom', label: 'Showroom' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const book = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-cyan-500/20 bg-neo-navy/75 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.45)]'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 font-display text-xl font-bold tracking-[0.35em] text-cyan-300 md:text-lg"
        >
          <span className="neon-text transition group-hover:text-white">NEO</span>
          <span className="text-fuchsia-300 transition group-hover:text-fuchsia-200">DRIVE</span>
        </Link>

        <nav className="hidden flex-1 justify-center md:flex">
          <ul className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative font-body text-sm text-slate-300 transition hover:text-cyan-200"
                >
                  <span className="relative z-10">{l.label}</span>
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!user && (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300 transition hover:text-cyan-200"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="rounded-full border border-fuchsia-500/35 px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-widest text-fuchsia-100 transition hover:border-cyan-400/45 hover:text-cyan-50"
              >
                Sign Up
              </button>
            </>
          )}
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="rounded-full border border-fuchsia-500/30 px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-widest text-fuchsia-200 transition hover:border-cyan-400/50 hover:text-cyan-100"
            >
              Admin
            </button>
          )}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="font-body text-xs text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
            >
              Sign out
            </button>
          )}
          <NeonButton type="button" onClick={book} className="!px-6 !py-2.5 !text-[10px]">
            Book Test Drive
          </NeonButton>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-cyan-300" />
          <span className="mt-1 block h-0.5 w-6 bg-fuchsia-300" />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-neo-navy/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block py-2 font-body text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <NeonButton type="button" onClick={book} className="w-full">
                Book Test Drive
              </NeonButton>
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  )
}
