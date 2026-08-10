/**
 * ResultsScreen — The diagnostic report with personality
 *
 * Sections:
 *   1. Score + Diagnosis Title
 *   2. Category Breakdown Bars
 *   3. System Recommendation
 *   4. Final Verdict GIF
 *   5. Easter Eggs
 *   6. Actions (Share + Restart)
 *   7. Disclaimer
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import GlowBar from '../components/GlowBar';
import { categoryLabels } from '../data/diagnoses';
import { fetchReactionGif } from '../utils/gifFetcher';
import { playAlarm, playSuccess } from '../utils/sound';
import './ResultsScreen.css';

export default function ResultsScreen({ results, onRestart }) {
  const {
    overallScore,
    categoryScores,
    diagnosis,
    recommendation,
    easterEggs,
  } = results;

  const [verdictGifUrl, setVerdictGifUrl] = useState(null);
  const [gifLoading, setGifLoading] = useState(true);

  // Score display (handle INTEGER OVERFLOW easter egg)
  const displayScore = overallScore === 100 ? 'ERR' : overallScore;
  const scoreFilled = Math.floor(overallScore / 5);
  const scoreEmpty = 20 - scoreFilled;
  const scoreBarText = '█'.repeat(scoreFilled) + '░'.repeat(scoreEmpty);

  // Sorted category entries for display
  const categoryEntries = useMemo(() => {
    return Object.entries(categoryScores)
      .map(([cat, score]) => ({
        key: cat,
        label: categoryLabels[cat] || cat,
        score,
      }))
      .sort((a, b) => b.score - a.score);
  }, [categoryScores]);

  // Sound + confetti + GIF on mount
  useEffect(() => {
    if (overallScore <= 20) {
      playSuccess();
      // Fire celebratory confetti
      const end = Date.now() + 2000;
      const fire = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#00FF9C', '#c4b5fd', '#a0c3ec'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#00FF9C', '#c4b5fd', '#a0c3ec'],
        });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      fire();
    } else if (overallScore >= 81) {
      playAlarm();
    }

    // Fetch verdict GIF
    const loadGif = async () => {
      setGifLoading(true);
      const url = await fetchReactionGif(diagnosis.verdictGif);
      setVerdictGifUrl(url);
      setGifLoading(false);
    };
    loadGif();
  }, [overallScore, diagnosis.verdictGif]);

  // Share functionality
  const handleShare = async () => {
    const shareText =
      `🔥 How Cooked Am I? — Diagnostic Report\n\n` +
      `Score: ${overallScore}/100\n` +
      `Diagnosis: ${diagnosis.emoji} ${diagnosis.title}\n` +
      `Status: ${overallScore >= 80 ? '🚨 CRITICAL' : overallScore >= 60 ? '⚠️ WARNING' : overallScore >= 40 ? '🟡 MODERATE' : '✅ NOMINAL'}\n\n` +
      `"${diagnosis.subtitle}"\n\n` +
      `Take the test: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'How Cooked Am I?', text: shareText });
        return;
      } catch (e) {
        // Fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      alert('📋 Results copied to clipboard! Share it with your friends.');
    } catch (e) {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('📋 Results copied to clipboard!');
    }
  };

  // Get color for category score
  const getCategoryColor = (score) => {
    if (score <= 20) return 'var(--zen)';
    if (score <= 40) return 'var(--mild)';
    if (score <= 60) return 'var(--medium)';
    if (score <= 80) return 'var(--cooked)';
    return 'var(--nuclear)';
  };

  return (
    <motion.div
      className="results-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="results-screen__container">

        {/* ─── Section 1: Score + Diagnosis ─────────── */}
        <motion.div
          className="results-screen__verdict"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="results-screen__eyebrow">DIAGNOSTIC REPORT</div>

          {/* Score */}
          <div className="results-screen__score-wrapper">
            <span className="results-screen__score-label">STRESS INDEX</span>
            <div className="results-screen__score-row">
              <span
                className="results-screen__score-number"
                style={{ color: diagnosis.color }}
              >
                {displayScore}
              </span>
              <span className="results-screen__score-unit">/ 100</span>
            </div>
            <div
              className="results-screen__score-bar"
              style={{ color: diagnosis.color }}
            >
              {scoreBarText}
            </div>
          </div>

          {/* Diagnosis title */}
          <div
            className="results-screen__diagnosis-title"
            style={{ color: diagnosis.color }}
          >
            {diagnosis.emoji} {diagnosis.title}
          </div>

          {/* Subtitle */}
          <div className="results-screen__diagnosis-subtitle">
            "{diagnosis.subtitle}"
          </div>

          {/* INTEGER OVERFLOW easter egg */}
          {overallScore === 100 && (
            <motion.div
              className="results-screen__overflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              🚨 ERROR: INTEGER OVERFLOW — Score exceeds maximum human tolerance
            </motion.div>
          )}
        </motion.div>

        {/* ─── Section 2: Category Breakdown ────────── */}
        <motion.div
          className="results-screen__panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="results-screen__panel-header">
            <span className="results-screen__panel-icon">◈</span>
            CATEGORY BREAKDOWN
          </div>
          <div className="results-screen__categories">
            {categoryEntries.map((entry, i) => (
              <GlowBar
                key={entry.key}
                label={entry.label}
                value={entry.score}
                color={getCategoryColor(entry.score)}
                delay={0.6 + i * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* ─── Section 3: Recommendation ────────────── */}
        <motion.div
          className="results-screen__panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <div className="results-screen__panel-header">
            <span className="results-screen__panel-icon">◈</span>
            SYSTEM RECOMMENDATION
          </div>
          <div className="results-screen__recommendation">
            <span className="results-screen__recommendation-prompt">&gt;_</span>
            {recommendation}
          </div>
        </motion.div>

        {/* ─── Section 4: Verdict GIF ───────────────── */}
        <motion.div
          className="results-screen__panel results-screen__gif-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <div className="results-screen__panel-header">
            <span className="results-screen__panel-icon">⚡</span>
            FINAL SYSTEM VERDICT
          </div>
          <div className="results-screen__gif-container">
            {gifLoading ? (
              <div className="results-screen__gif-loading">
                [ FETCHING VISUAL REACTION... ]
              </div>
            ) : verdictGifUrl ? (
              <img
                src={verdictGifUrl}
                alt="Final verdict reaction"
                className="results-screen__gif"
              />
            ) : (
              <div className="results-screen__gif-loading">
                [ VISUAL REACTION UNAVAILABLE ]
              </div>
            )}
          </div>
        </motion.div>

        {/* ─── Section 5: Easter Eggs ───────────────── */}
        {easterEggs.length > 0 && (
          <motion.div
            className="results-screen__easter-eggs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.4 }}
          >
            {easterEggs.map((egg, i) => (
              <div key={i} className="results-screen__easter-egg">{egg}</div>
            ))}
          </motion.div>
        )}

        {/* ─── Section 6: Actions ───────────────────── */}
        <motion.div
          className="results-screen__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          <button
            id="share-results-button"
            className="btn-pill"
            onClick={handleShare}
          >
            📤 SHARE RESULTS
          </button>
          <button
            id="restart-scan-button"
            className="btn-pill btn-pill--filled"
            onClick={onRestart}
          >
            🔄 RUN NEW SCAN
          </button>
        </motion.div>

        {/* ─── Section 7: Disclaimer ────────────────── */}
        <motion.div
          className="results-screen__disclaimer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.4 }}
        >
          <p>⚠ This is a fun self-assessment, not a medical diagnosis.</p>
          <p>If you're genuinely struggling, please reach out to a professional. 💛</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
