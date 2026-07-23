import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import confetti from 'canvas-confetti';
import GlowBar from '../components/GlowBar';
import {
  calculateScore, getCookedLevel, generateTelemetry,
  getDiagnostics, getEasterEggs, getAdvice,
} from '../utils/scoring';
import { playAlarm, playSuccess } from '../utils/sound';
import './ResultsScreen.css';

// Fallback to Giphy public beta key if user hasn't provided one in .env
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';


/**
 * ResultsScreen — Full AI diagnostic report with telemetry, charts, and share.
 *
 * @param {Object} answers — user answers map
 * @param {function} onRestart — callback to restart the app
 */
export default function ResultsScreen({ answers, onRestart }) {
  const score = useMemo(() => calculateScore(answers), [answers]);
  const cookedLevel = useMemo(() => getCookedLevel(score), [score]);
  const telemetry = useMemo(() => generateTelemetry(answers, score), [answers, score]);
  const diagnosticsList = useMemo(() => getDiagnostics(answers), [answers]);
  const easterEggs = useMemo(() => getEasterEggs(answers, score), [answers, score]);
  const recommendation = useMemo(() => getAdvice(cookedLevel.tier), [cookedLevel.tier]);

  const [memeUrl, setMemeUrl] = useState(null);
  const [memeLoading, setMemeLoading] = useState(true);

  // Display score (handle INTEGER OVERFLOW easter egg)
  const displayScore = score === 100 ? 'ERR' : score;

  // Sound + confetti effects on mount
  useEffect(() => {
    if (score <= 20) {
      playSuccess();
      // Fire confetti for low stress
      const end = Date.now() + 2000;
      const fire = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#00FF9C', '#00E5FF', '#7AFF5E'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#00FF9C', '#00E5FF', '#7AFF5E'],
        });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      fire();
    } else if (score >= 81) {
      playAlarm();
      // Voice removed as per request
    } else {
      // Voice removed as per request
    }

    // Fetch meme reaction based on tier
    const fetchMeme = async () => {
      try {
        setMemeLoading(true);
        const tierMemeMap = {
          fresh: 'peaceful nature calm zen',
          mild: 'sweaty smile nervous',
          medium: 'tired sigh working computer',
          deep: 'stress burning fire panic',
          cooked: 'skeleton computer dead exhausted',
          beyond: 'nuclear explosion space catastrophic'
        };
        const query = tierMemeMap[cookedLevel.tier] || 'computer error';
        
        // Use Giphy
        const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=5&rating=pg-13`;
        
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          // Pick a random meme from top 5
          const randomIndex = Math.floor(Math.random() * Math.min(data.data.length, 5));
          setMemeUrl(data.data[randomIndex].images.downsized_medium.url);
        }
      } catch (err) {
        console.error("Failed to fetch results meme:", err);
      } finally {
        setMemeLoading(false);
      }
    };
    
    fetchMeme();
  }, [score, cookedLevel.tier]);

  // Share functionality
  const handleShare = async () => {
    const shareText = `🔥 How Cooked Am I? — AI Diagnostic Report\n\n` +
      `Score: ${score}/100\n` +
      `Level: ${cookedLevel.label}\n` +
      `Status: ${score >= 80 ? '🚨 CRITICAL' : score >= 60 ? '⚠️ WARNING' : score >= 40 ? '🟡 MODERATE' : '✅ NOMINAL'}\n\n` +
      `Recommendation: ${recommendation}\n\n` +
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
      // Final fallback: select text
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('📋 Results copied to clipboard!');
    }
  };

  const triggeredDiagnostics = diagnosticsList.filter((d) => d.triggered);
  const clearDiagnostics = diagnosticsList.filter((d) => !d.triggered);

  // Score bar fill text
  const scoreFilled = Math.floor(score / 5);
  const scoreEmpty = 20 - scoreFilled;
  const scoreBarText = '█'.repeat(scoreFilled) + '░'.repeat(scoreEmpty);

  return (
    <motion.div
      className="results-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="results-screen__container">
        {/* Report Header */}
        <motion.div
          className="results-screen__report-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="results-screen__report-badge">DIAGNOSTIC REPORT</div>
          <h1 className="results-screen__report-title">SYSTEM ANALYSIS COMPLETE</h1>
          <p className="results-screen__report-id">
            REPORT #{Math.floor(Math.random() * 90000 + 10000)} // {new Date().toISOString().split('T')[0]}
          </p>
        </motion.div>

        {/* Score Section */}
        <motion.div
          className="results-screen__score-section"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="results-screen__score-card" style={{ borderColor: cookedLevel.color + '44' }}>
            {/* Main score */}
            <div className="results-screen__score-main">
              <div
                className="results-screen__score-number"
                style={{ color: cookedLevel.color, textShadow: `0 0 30px ${cookedLevel.color}66` }}
              >
                {displayScore}
                {score !== 100 && <span className="results-screen__score-unit">%</span>}
              </div>
              <div className="results-screen__score-bar">
                <span style={{ color: cookedLevel.color }}>{scoreBarText}</span>
              </div>
            </div>

            {/* Cooked level */}
            <div
              className="results-screen__level"
              style={{ color: cookedLevel.color, borderColor: cookedLevel.color + '44' }}
            >
              {cookedLevel.label}
            </div>

            {/* INTEGER OVERFLOW easter egg */}
            {score === 100 && (
              <motion.div
                className="results-screen__overflow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                🚨 ERROR: INTEGER OVERFLOW — Score exceeds maximum human tolerance
              </motion.div>
            )}

            {/* Risk Level Bar */}
            <div className="results-screen__risk">
              <div className="results-screen__risk-label">RISK LEVEL</div>
              <div className="results-screen__risk-track">
                <motion.div
                  className="results-screen__risk-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                  style={{
                    background: `linear-gradient(90deg, #00FF9C, #FF9E2C, #FF4D4D)`,
                  }}
                />
                <motion.div
                  className="results-screen__risk-marker"
                  initial={{ left: '0%' }}
                  animate={{ left: `${score}%` }}
                  transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <div className="results-screen__risk-labels">
                <span>NOMINAL</span>
                <span>WARNING</span>
                <span>CRITICAL</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Easter Eggs */}
        {easterEggs.length > 0 && (
          <motion.div
            className="results-screen__easter-eggs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            {easterEggs.map((egg, i) => (
              <div key={i} className="results-screen__easter-egg">{egg}</div>
            ))}
          </motion.div>
        )}

        {/* Two-column layout for diagnostics + telemetry */}
        <div className="results-screen__grid">
          {/* Diagnostics Panel */}
          <motion.div
            className="results-screen__panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="results-screen__panel-header">◈ DIAGNOSTICS</div>
            <div className="results-screen__diagnostics">
              {triggeredDiagnostics.map((d, i) => (
                <motion.div
                  key={d.label}
                  className="results-screen__diagnostic results-screen__diagnostic--warning"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                >
                  <span className="results-screen__diagnostic-icon">⚠</span>
                  {d.label}
                </motion.div>
              ))}
              {clearDiagnostics.slice(0, 4).map((d, i) => (
                <motion.div
                  key={d.label}
                  className="results-screen__diagnostic results-screen__diagnostic--clear"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (triggeredDiagnostics.length + i) * 0.05 }}
                >
                  <span className="results-screen__diagnostic-icon">✔</span>
                  {d.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System Telemetry Bars */}
          <motion.div
            className="results-screen__panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="results-screen__panel-header">◈ SYSTEM TELEMETRY</div>
            <div className="results-screen__telemetry-bars">
              {telemetry.bars.map((bar, i) => (
                <GlowBar
                  key={bar.label}
                  label={bar.label}
                  value={bar.value}
                  color={bar.color}
                  delay={0.8 + i * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="results-screen__charts">
          {/* Stress Line Chart */}
          <motion.div
            className="results-screen__chart-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="results-screen__panel-header">◈ STRESS TELEMETRY (7-DAY)</div>
            <div className="results-screen__chart-wrapper">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={telemetry.stressHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
                  <XAxis dataKey="day" tick={{ fill: '#6b7b8d', fontSize: 11 }} axisLine={{ stroke: '#1a2332' }} />
                  <YAxis tick={{ fill: '#6b7b8d', fontSize: 11 }} axisLine={{ stroke: '#1a2332' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#0F1720', border: '1px solid #1a2332', borderRadius: 6, color: '#e0e6ed' }}
                    labelStyle={{ color: '#00E5FF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="#FF4D4D"
                    strokeWidth={2}
                    dot={{ fill: '#FF4D4D', r: 3 }}
                    activeDot={{ r: 5, fill: '#FF4D4D', stroke: '#FF4D4D33', strokeWidth: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Sleep Bar Chart */}
          <motion.div
            className="results-screen__chart-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="results-screen__panel-header">◈ SLEEP BUFFER (7-DAY)</div>
            <div className="results-screen__chart-wrapper">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={telemetry.sleepHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
                  <XAxis dataKey="day" tick={{ fill: '#6b7b8d', fontSize: 11 }} axisLine={{ stroke: '#1a2332' }} />
                  <YAxis tick={{ fill: '#6b7b8d', fontSize: 11 }} axisLine={{ stroke: '#1a2332' }} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ background: '#0F1720', border: '1px solid #1a2332', borderRadius: 6, color: '#e0e6ed' }}
                    labelStyle={{ color: '#00E5FF' }}
                  />
                  <Bar dataKey="hours" fill="#00E5FF" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recommendation */}
        <motion.div
          className="results-screen__recommendation"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <div className="results-screen__panel-header">◈ SYSTEM RECOMMENDATION</div>
          <div className="results-screen__recommendation-text">
            <span className="results-screen__recommendation-prompt">&gt;_</span>
            {recommendation}
          </div>
        </motion.div>

        {/* Reaction Meme */}
        <motion.div
          className="results-screen__meme-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <div className="results-screen__panel-header">⚡ FINAL SYSTEM VERDICT (VISUAL)</div>
          <div className="results-screen__meme-container">
            {memeLoading ? (
              <div className="results-screen__meme-loading">
                <span>[ FETCHING VISUAL REACTION... ]</span>
              </div>
            ) : memeUrl ? (
              <img src={memeUrl} alt="Reaction meme" className="results-screen__meme-img" />
            ) : (
              <div className="results-screen__meme-loading">
                <span>[ VISUAL REACTION UNAVAILABLE ]</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="results-screen__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <button className="results-screen__btn results-screen__btn--share" onClick={handleShare}>
            <span>📤</span> SHARE RESULTS
          </button>
          <button className="results-screen__btn results-screen__btn--restart" onClick={onRestart}>
            <span>🔄</span> RUN NEW SCAN
          </button>
        </motion.div>

        {/* Footer */}
        <div className="results-screen__footer">
          <p>HOW COOKED AM I? // v4.2.0 // DIAGNOSTIC SYSTEMS INC.</p>
          <p>This report is 100% AI-generated nonsense. Please consult a real human if you need actual help. 💛</p>
        </div>
      </div>
    </motion.div>
  );
}
