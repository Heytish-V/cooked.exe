import { motion } from 'framer-motion';

/**
 * GlowBar — Animated progress/stat bar with neon glow effect.
 *
 * @param {string} label — bar label text
 * @param {number} value — 0–100 fill percentage
 * @param {string} color — neon color for the bar fill and glow
 * @param {number} delay — animation delay in seconds (for staggered reveals)
 * @param {boolean} showValue — whether to show the numeric value
 */
export default function GlowBar({ label, value, color = '#00E5FF', delay = 0, showValue = true }) {
  return (
    <div className="glow-bar">
      <div className="glow-bar__header">
        <span className="glow-bar__label">{label}</span>
        {showValue && <span className="glow-bar__value" style={{ color }}>{value}%</span>}
      </div>
      <div className="glow-bar__track">
        <motion.div
          className="glow-bar__fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}66, 0 0 20px ${color}33`,
          }}
        />
      </div>
    </div>
  );
}
