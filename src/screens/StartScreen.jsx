/**
 * StartScreen — Terminal-styled landing page for COOKED.EXE
 *
 * xAI-inspired aesthetic: near-black canvas, white pill CTA,
 * mono-uppercase eyebrows, typewriter subtitle.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from '../components/TypewriterText';
import { markInteraction } from '../utils/sound';
import './StartScreen.css';

export default function StartScreen({ onStart }) {
  const [sessionId] = useState(() =>
    Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
  );
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCta(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    markInteraction();
    onStart();
  };

  return (
    <motion.div
      className="start-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
    >
      <div className="start-screen__container">
        {/* OS Header Bar */}
        <div className="start-screen__header">
          <span className="start-screen__header-title">COOKED.EXE</span>
          <span className="start-screen__header-session">SESSION: {sessionId}</span>
        </div>

        {/* Main Content Card */}
        <div className="start-screen__card">
          {/* Eyebrow */}
          <motion.div
            className="start-screen__eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            STRESS DIAGNOSTIC SYSTEM
          </motion.div>

          {/* Title */}
          <motion.h1
            className="start-screen__title"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            How Cooked Am I?
          </motion.h1>

          {/* Subtitle with typewriter */}
          <motion.div
            className="start-screen__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <TypewriterText
              text="Let's see how stressed you really are."
              speed={35}
            />
          </motion.div>

          {/* Start Button */}
          {showCta && (
            <motion.div
              className="start-screen__cta-wrapper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                id="start-scan-button"
                className="start-screen__cta"
                onClick={handleStart}
              >
                START SCAN
              </button>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            className="start-screen__disclaimer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            ⚠ Fun self-assessment. Not a medical diagnosis.
          </motion.div>
        </div>

        {/* Footer status */}
        <div className="start-screen__footer">
          <span className="start-screen__footer-dot" />
          SYSTEM READY // v2.0.0
        </div>
      </div>
    </motion.div>
  );
}
