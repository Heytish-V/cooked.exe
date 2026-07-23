import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from '../components/TypewriterText';
import './BootScreen.css';

/**
 * BootScreen — Animated initialization sequence.
 * Displays a fake system boot with progress bar, then auto-advances.
 *
 * @param {function} onComplete — called when boot sequence finishes
 */

const bootLines = [
  'INITIALIZING NEURAL INTERFACE...',
  'LOADING SARCASM MODULE... OK',
  'CALIBRATING BURNOUT SENSORS... OK',
  'CONNECTING TO CAFFEINE DATABASE... OK',
  'MOUNTING /dev/existential_crisis... OK',
  'SYSTEM READY.',
];

export default function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 4 + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Cycle through boot lines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= bootLines.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Show title after a short delay
  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 500);
    const t2 = setTimeout(() => setShowSubtitle(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Auto-advance when progress completes
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(onComplete, 1200);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const progressClamped = Math.min(100, Math.floor(progress));
  const filled = Math.floor(progressClamped / 5);
  const empty = 20 - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <motion.div
      className="boot-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Radar sweep */}
      <div className="boot-screen__radar" aria-hidden="true">
        <div className="boot-screen__radar-sweep" />
        <div className="boot-screen__radar-ring boot-screen__radar-ring--1" />
        <div className="boot-screen__radar-ring boot-screen__radar-ring--2" />
        <div className="boot-screen__radar-ring boot-screen__radar-ring--3" />
      </div>

      <div className="boot-screen__content">
        {/* Title */}
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="boot-screen__title">SYSTEM DIAGNOSTICS</h1>
          </motion.div>
        )}

        {showSubtitle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="boot-screen__subtitle">HOW COOKED AM I?</h2>
            <p className="boot-screen__version">v4.2.0 // BURNOUT EDITION</p>
          </motion.div>
        )}

        {/* Boot log */}
        <div className="boot-screen__log">
          {bootLines.slice(0, currentLine + 1).map((line, i) => (
            <motion.div
              key={i}
              className="boot-screen__log-line"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="boot-screen__log-prefix">[SYS]</span> {line}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="boot-screen__progress">
          <div className="boot-screen__progress-label">
            <TypewriterText
              text="Initializing Scan..."
              speed={50}
            />
          </div>
          <div className="boot-screen__progress-bar">
            <span className="boot-screen__progress-fill">{progressBar}</span>
            <span className="boot-screen__progress-pct">{progressClamped}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
