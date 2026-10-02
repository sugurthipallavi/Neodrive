import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-200/70">
        Scroll
      </span>
      <motion.div
        className="flex h-12 w-7 items-start justify-center rounded-full border border-cyan-400/40 pt-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <motion.span
          className="h-2 w-2 rounded-full bg-gradient-to-b from-cyan-300 to-fuchsia-400 shadow-neon-sm"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 12, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  )
}
