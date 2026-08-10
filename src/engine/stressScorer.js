/**
 * stressScorer.js — Scoring engine for the stress diagnostic
 *
 * Calculates:
 *   - Overall stress score (0–100, normalized)
 *   - Per-category stress scores
 *   - Easter egg achievements based on answer combos
 */

import { getDiagnosis, getRandomAdvice, categoryLabels } from '../data/diagnoses';

/**
 * Calculate all results from user answers.
 *
 * @param {Array} answeredQuestions — the 10 questions that were asked
 *   (each question object from the pool)
 * @param {Object} answers — map of questionId → selected option index
 * @returns {{
 *   overallScore: number,
 *   categoryScores: Object,
 *   diagnosis: Object,
 *   recommendation: string,
 *   easterEggs: string[],
 * }}
 */
export function calculateResults(answeredQuestions, answers) {
  // ─── Overall score ─────────────────────────────────────
  let totalWeight = 0;
  let maxWeight = 0;

  for (const q of answeredQuestions) {
    maxWeight += 5; // max possible weight per question
    const idx = answers[q.id];
    if (idx !== undefined && q.options[idx]) {
      totalWeight += q.options[idx].weight;
    }
  }

  const overallScore = maxWeight === 0
    ? 0
    : Math.min(100, Math.max(0, Math.round((totalWeight / maxWeight) * 100)));

  // ─── Per-category scores ───────────────────────────────
  const catTotals = {};
  const catMaxes = {};

  for (const q of answeredQuestions) {
    const cat = q.category;
    if (!catTotals[cat]) {
      catTotals[cat] = 0;
      catMaxes[cat] = 0;
    }
    catMaxes[cat] += 5;
    const idx = answers[q.id];
    if (idx !== undefined && q.options[idx]) {
      catTotals[cat] += q.options[idx].weight;
    }
  }

  const categoryScores = {};
  for (const cat of Object.keys(categoryLabels)) {
    if (catMaxes[cat] && catMaxes[cat] > 0) {
      categoryScores[cat] = Math.round((catTotals[cat] / catMaxes[cat]) * 100);
    }
    // Only include categories that had questions in this session
  }

  // ─── Diagnosis ─────────────────────────────────────────
  const diagnosis = getDiagnosis(overallScore);
  const recommendation = getRandomAdvice(diagnosis);

  // ─── Easter eggs ───────────────────────────────────────
  const easterEggs = detectEasterEggs(answeredQuestions, answers, overallScore);

  return {
    overallScore,
    categoryScores,
    diagnosis,
    recommendation,
    easterEggs,
  };
}

/**
 * Detect easter egg achievements from answer combos.
 */
function detectEasterEggs(questions, answers, score) {
  const eggs = [];

  // Helper: get option weight for a question id
  const getWeight = (qId) => {
    const q = questions.find((x) => x.id === qId);
    const idx = answers[qId];
    return q && idx !== undefined && q.options[idx] ? q.options[idx].weight : -1;
  };

  // Perfect burnout
  if (score === 100) {
    eggs.push('🚨 ERROR: INTEGER OVERFLOW — Score exceeds maximum human tolerance.');
  }
  if (score >= 95) {
    eggs.push('🏆 Achievement Unlocked: Beyond Recovery');
  }
  if (score >= 90) {
    eggs.push('⚠️ KERNEL PANIC: User.exe has stopped responding.');
  }

  // Extreme caffeine
  if (getWeight('caffeine') >= 5) {
    eggs.push('☕ ALERT: You are now legally espresso. Your blood type is Arabica.');
  }

  // Procrastinating with deadlines
  if (getWeight('procrastination') >= 4 && getWeight('deadlines') >= 5) {
    eggs.push('🔥 Achievement Unlocked: Procrastinating with a burning deadline — true chaos energy.');
  }

  // Social battery dead + existential crisis
  if (getWeight('social_battery') >= 5 && getWeight('existential') >= 5) {
    eggs.push('🌀 Achievement Unlocked: Existential Hermit Mode — You are both the philosopher and the cave.');
  }

  // Meta awareness: taking the quiz to procrastinate
  if (getWeight('quiz_meta') >= 4) {
    eggs.push('🔁 META DETECTED: You are procrastinating by taking a quiz about procrastination.');
  }

  // Perfect score (zero stress)
  if (score === 0) {
    eggs.push('✨ ANOMALY DETECTED: Subject appears to be... happy? Running additional scans...');
  }
  if (score <= 10) {
    eggs.push('🌿 System Note: You are disturbingly well-adjusted. Please report to the lab for study.');
  }

  return eggs;
}
