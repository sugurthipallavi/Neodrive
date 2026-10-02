import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const items = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Twitter, href: 'https://twitter.com', label: 'X / Twitter' },
  { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
]

/** Floating neon social rail — desktop-first */
export default function SocialSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {items.map(({ Icon, href, label }, i) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="pointer-events-auto glass-panel flex h-11 w-11 items-center justify-center rounded-xl text-cyan-200 shadow-none transition hover:border-cyan-400/60 hover:text-white hover:shadow-neon-sm"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </motion.a>
      ))}
    </motion.div>
  )
}
