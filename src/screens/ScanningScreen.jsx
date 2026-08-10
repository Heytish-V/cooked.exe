/**
 * AnalyzingScreen — Brief "computing diagnosis" transition
 *
 * Runs for ~4 seconds with humorous processing lines,
 * then auto-advances to results.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ScanningScreen.css';

const processingLines = [
  'Cross-referencing excuse database...',
  'Calculating caffeine dependency index...',
  'Measuring remaining will to live...',
  'Scanning for signs of functioning...',
  'Compiling diagnostic report...',
  'Generating roast protocol...',
];

export default function AnalyzingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Cycle through processing lines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= processingLines.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance when progress completes
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(onComplete, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const progressClamped = Math.min(100, Math.floor(progress));
  const filled = Math.floor(progressClamped / 5);
  const empty = 20 - filled;
  const progressBarText = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <motion.div
      className="analyzing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="analyzing-screen__container">
        <div className="analyzing-screen__card">
          {/* Title */}
          <motion.div
            className="analyzing-screen__title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            COMPILING DIAGNOSIS...
          </motion.div>

          {/* Progress bar */}
          <div className="analyzing-screen__progress">
            <div className="analyzing-screen__progress-bar">
              <span className="analyzing-screen__progress-fill">{progressBarText}</span>
              <span className="analyzing-screen__progress-pct">{progressClamped}%</span>
            </div>
          </div>

          {/* Processing lines */}
          <div className="analyzing-screen__lines">
            {processingLines.slice(0, currentLine + 1).map((line, i) => (
              <motion.div
                key={i}
                className={`analyzing-screen__line ${
                  i < currentLine
                    ? 'analyzing-screen__line--done'
                    : 'analyzing-screen__line--active'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="analyzing-screen__line-prefix">
                  {i < currentLine ? '✓' : '▸'}
                </span>
                <span className="analyzing-screen__line-text">{line}</span>
                {i < currentLine && (
                  <span className="analyzing-screen__line-ok">OK</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom warning */}
        <div className="analyzing-screen__warning">
          ⚠ Please do not close this window or touch grass during analysis.
        </div>
      </div>
    </motion.div>
  );
}
