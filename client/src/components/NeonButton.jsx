import { motion } from 'framer-motion'

/** Primary CTA — neon gradient, glow, hover scale */
export default function NeonButton({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled,
  ...props
}) {
  const base =
    'relative overflow-hidden rounded-full px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] transition-shadow duration-300 md:text-xs'

  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-neo-black shadow-neon hover:shadow-[0_0_40px_rgba(0,212,255,0.55)]'
      : 'border border-cyan-400/40 bg-white/5 text-cyan-100 hover:border-fuchsia-400/60 hover:bg-white/10 hover:shadow-neon-sm'

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${base} ${styles} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/25 to-transparent opacity-40"
        />
      )}
    </motion.button>
  )
}
