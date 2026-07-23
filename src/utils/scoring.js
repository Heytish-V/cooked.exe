/**
 * scoring.js — Score calculation, cooked level mapping, telemetry generation, and easter eggs
 *
 * All scoring logic is centralized here for easy customization.
 */

import questions from '../data/questions';
import advice from '../data/advice';
import diagnosticDefs from '../data/diagnostics';

/**
 * Calculate the cooked score (0–100) from user answers.
 * @param {Object} answers — map of questionId → selected option index
 * @returns {number} score 0–100
 */
export function calculateScore(answers) {
  let totalWeight = 0;
  let maxWeight = 0;

  questions.forEach((q) => {
    maxWeight += 5; // max possible weight per question
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.options[selectedIndex]) {
      totalWeight += q.options[selectedIndex].weight;
    }
  });

  if (maxWeight === 0) return 0;
  const raw = (totalWeight / maxWeight) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

/**
 * Get the cooked level label and color for a given score.
 * @param {number} score — 0–100
 * @returns {{ label: string, color: string, tier: string }}
 */
export function getCookedLevel(score) {
  if (score <= 20) return { label: 'FRESHLY COMPILED', color: '#00FF9C', tier: 'fresh' };
  if (score <= 40) return { label: 'MILDLY TOASTED', color: '#7AFF5E', tier: 'mild' };
  if (score <= 60) return { label: 'MEDIUM RARE', color: '#FF9E2C', tier: 'medium' };
  if (score <= 80) return { label: 'DEEP FRIED', color: '#FF6B2C', tier: 'deep' };
  if (score <= 95) return { label: 'ABSOLUTELY COOKED', color: '#FF4D4D', tier: 'cooked' };
  return { label: 'BEYOND RECOVERY', color: '#FF0040', tier: 'beyond' };
}

/**
 * Generate fake telemetry data for the results charts.
 * @param {Object} answers — user answers
 * @param {number} score — calculated score
 * @returns {{ bars: Array, stressHistory: Array, sleepHistory: Array }}
 */
export function generateTelemetry(answers, score) {
  const jitter = () => Math.floor(Math.random() * 20) - 10;

  // Get specific answer weights for targeted telemetry
  const getWeight = (qId) => {
    const q = questions.find((x) => x.id === qId);
    const idx = answers[qId];
    return (q && idx !== undefined && q.options[idx]) ? q.options[idx].weight : 2;
  };

  const bars = [
    { label: 'CPU Stress', value: Math.min(100, Math.max(5, score + jitter())), color: score > 70 ? '#FF4D4D' : '#00E5FF' },
    { label: 'Coffee Level', value: Math.min(100, Math.max(5, getWeight('caffeine') * 20 + jitter())), color: '#FF9E2C' },
    { label: 'Sleep Buffer', value: Math.min(100, Math.max(5, 100 - getWeight('sleep') * 20 + jitter())), color: '#00FF9C' },
    { label: 'Motivation', value: Math.min(100, Math.max(5, 100 - score + jitter())), color: score > 70 ? '#FF4D4D' : '#00E5FF' },
    { label: 'System Integrity', value: Math.min(100, Math.max(5, 100 - score * 0.8 + jitter())), color: score > 60 ? '#FF9E2C' : '#00FF9C' },
    { label: 'Memory Available', value: Math.min(100, Math.max(5, 100 - getWeight('mentalstate') * 18 + jitter())), color: '#00E5FF' },
    { label: 'Brain Temperature', value: Math.min(100, Math.max(5, score * 0.9 + jitter())), color: score > 75 ? '#FF4D4D' : '#FF9E2C' },
  ];

  // Fake stress history over 7 "days"
  const stressHistory = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    stress: Math.min(100, Math.max(10, score - 30 + i * 8 + Math.floor(Math.random() * 15))),
  }));

  // Fake sleep history over 7 "days"
  const sleepHistory = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    hours: Math.max(1, Math.min(10, 8 - getWeight('sleep') + Math.random() * 3 - 1.5)).toFixed(1),
  }));

  return { bars, stressHistory, sleepHistory };
}

/**
 * Detect triggered diagnostics based on user answers.
 * @param {Object} answers — user answers
 * @returns {Array<{ label: string, triggered: boolean, type: string }>}
 */
export function getDiagnostics(answers) {
  return diagnosticDefs.map((d) => {
    const q = questions.find((x) => x.id === d.questionId);
    const idx = answers[d.questionId];
    const weight = (q && idx !== undefined && q.options[idx]) ? q.options[idx].weight : 0;
    return {
      label: d.label,
      triggered: weight >= d.threshold,
      type: d.type,
    };
  });
}

/**
 * Get easter eggs triggered by the user's answers and score.
 * @param {Object} answers — user answers
 * @param {number} score — calculated score
 * @returns {Array<string>}
 */
export function getEasterEggs(answers, score) {
  const eggs = [];

  if (score === 100) {
    eggs.push('🚨 ERROR: INTEGER OVERFLOW — Score exceeds maximum human tolerance.');
  }
  if (score > 95) {
    eggs.push('🏆 Achievement Unlocked: Beyond Recovery');
  }
  if (score >= 90) {
    eggs.push('⚠️ KERNEL PANIC: User.exe has stopped responding.');
  }

  // Extreme caffeine
  const caffeineIdx = answers['caffeine'];
  const caffeineQ = questions.find((q) => q.id === 'caffeine');
  if (caffeineQ && caffeineIdx !== undefined && caffeineQ.options[caffeineIdx]?.weight >= 5) {
    eggs.push('☕ ALERT: You are now legally espresso. Your blood type is Arabica.');
  }

  // Extreme procrastination + deadlines
  const procIdx = answers['procrastination'];
  const deadIdx = answers['deadlines'];
  const procQ = questions.find((q) => q.id === 'procrastination');
  const deadQ = questions.find((q) => q.id === 'deadlines');
  if (
    procQ && procIdx !== undefined && procQ.options[procIdx]?.weight >= 4 &&
    deadQ && deadIdx !== undefined && deadQ.options[deadIdx]?.weight >= 5
  ) {
    eggs.push('🔥 Achievement Unlocked: Procrastinating with a burning deadline — true chaos energy.');
  }

  // Zero social battery + existential crisis
  const socialIdx = answers['socialbattery'];
  const existIdx = answers['existential'];
  const socialQ = questions.find((q) => q.id === 'socialbattery');
  const existQ = questions.find((q) => q.id === 'existential');
  if (
    socialQ && socialIdx !== undefined && socialQ.options[socialIdx]?.weight >= 5 &&
    existQ && existIdx !== undefined && existQ.options[existIdx]?.weight >= 5
  ) {
    eggs.push('🌀 Achievement Unlocked: Existential Hermit Mode — You are both the philosopher and the cave.');
  }

  // Perfect score (everything at 0)
  if (score === 0) {
    eggs.push('✨ ANOMALY DETECTED: Subject appears to be... happy? Running additional scans...');
  }

  // Low score
  if (score <= 10) {
    eggs.push('🌿 System Note: You are disturbingly well-adjusted. Please report to the lab for study.');
  }

  return eggs;
}

/**
 * Get a random piece of advice for the given score tier.
 * @param {string} tier — one of: fresh, mild, medium, deep, cooked, beyond
 * @returns {string}
 */
export function getAdvice(tier) {
  const pool = advice[tier] || advice.medium;
  return pool[Math.floor(Math.random() * pool.length)];
}
