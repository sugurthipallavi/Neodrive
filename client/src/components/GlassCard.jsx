import { motion } from 'framer-motion'

/** Holographic-style glass card */
export default function GlassCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay }}
      className={`glass-panel rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
