import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlowBar from '../components/GlowBar';
import { speak } from '../utils/sound';
import './ScanningScreen.css';

/**
 * ScanningScreen — Fake diagnostic scan with animated phases.
 * Runs for ~6 seconds, then calls onComplete.
 *
 * @param {function} onComplete — called when scanning finishes
 */

const scanPhases = [
  { text: 'Scanning Human...', duration: 900 },
  { text: 'Checking Sleep Subsystem...', duration: 800 },
  { text: 'Checking Caffeine Levels...', duration: 800 },
  { text: 'Checking Assignment Damage...', duration: 800 },
  { text: 'Analyzing Mental Stability...', duration: 900 },
  { text: 'Cross-referencing Excuses Database...', duration: 700 },
  { text: 'Compiling Roast Protocol...', duration: 600 },
  { text: 'Generating Report...', duration: 800 },
];

const telemetryBars = [
  { label: 'CPU Stress', targetValue: 73, color: '#FF9E2C' },
  { label: 'Coffee Level', targetValue: 85, color: '#FF4D4D' },
  { label: 'Sleep Buffer', targetValue: 28, color: '#00FF9C' },
  { label: 'Motivation', targetValue: 15, color: '#00E5FF' },
];

export default function ScanningScreen({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  // Speak on mount
  useEffect(() => {
    // Voice removed as per request
  }, []);

  // Cycle through scan phases
  useEffect(() => {
    if (currentPhase >= scanPhases.length) {
      const timeout = setTimeout(onComplete, 600);
      return () => clearTimeout(timeout);
    }

    setPhaseProgress(0);
    const phase = scanPhases[currentPhase];
    const steps = 20;
    const stepDuration = phase.duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setPhaseProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => setCurrentPhase((prev) => prev + 1), 200);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [currentPhase, onComplete]);

  return (
    <motion.div
      className="scanning-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="scanning-screen__container">
        {/* Header */}
        <div className="scanning-screen__header">
          <div className="scanning-screen__badge">⚡ ANALYZING</div>
          <h2 className="scanning-screen__title">DIAGNOSTIC SCAN IN PROGRESS</h2>
          <p className="scanning-screen__subtitle">Please do not close this window or touch grass during analysis.</p>
        </div>

        {/* Scan phases */}
        <div className="scanning-screen__phases">
          {scanPhases.map((phase, i) => (
            <motion.div
              key={i}
              className={`scanning-screen__phase ${
                i < currentPhase
                  ? 'scanning-screen__phase--complete'
                  : i === currentPhase
                  ? 'scanning-screen__phase--active'
                  : 'scanning-screen__phase--pending'
              }`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <span className="scanning-screen__phase-icon">
                {i < currentPhase ? '✓' : i === currentPhase ? '▸' : '○'}
              </span>
              <span className="scanning-screen__phase-text">{phase.text}</span>
              {i === currentPhase && (
                <span className="scanning-screen__phase-pct">{phaseProgress}%</span>
              )}
              {i < currentPhase && (
                <span className="scanning-screen__phase-done">OK</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Animated progress bar for current phase */}
        <div className="scanning-screen__bar-container">
          <div className="scanning-screen__bar-track">
            <motion.div
              className="scanning-screen__bar-fill"
              animate={{ width: `${currentPhase >= scanPhases.length ? 100 : ((currentPhase + phaseProgress / 100) / scanPhases.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="scanning-screen__bar-label">
            Overall Progress: {currentPhase >= scanPhases.length ? 100 : Math.round(((currentPhase + phaseProgress / 100) / scanPhases.length) * 100)}%
          </div>
        </div>

        {/* Fake telemetry during scan */}
        <div className="scanning-screen__telemetry">
          <div className="scanning-screen__telemetry-header">LIVE TELEMETRY</div>
          <div className="scanning-screen__telemetry-bars">
            {telemetryBars.map((bar, i) => (
              <GlowBar
                key={bar.label}
                label={bar.label}
                value={currentPhase > i + 1 ? bar.targetValue : currentPhase === i + 1 ? Math.round(bar.targetValue * phaseProgress / 100) : 0}
                color={bar.color}
                delay={0}
              />
            ))}
          </div>
        </div>

        {/* Hex data decoration */}
        <div className="scanning-screen__hex" aria-hidden="true">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="scanning-screen__hex-line">
              {Array.from({ length: 8 }, (_, j) => (
                <span key={j}>
                  {Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0').toUpperCase()}
                </span>
              )).join(' ')}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
