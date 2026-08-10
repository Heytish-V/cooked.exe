/**
 * diagnoses.js — 5-tier stress diagnoses with personality
 *
 * Each tier has:
 *   - title: the diagnosis name (all caps)
 *   - emoji: visual indicator
 *   - subtitle: funny one-liner description
 *   - color: accent color for the result display
 *   - advice: pool of humorous recommendations (one picked randomly)
 *   - verdictGif: search term for the final verdict GIF
 */

const diagnoses = [
  {
    tier: 'zen',
    minScore: 0,
    maxScore: 20,
    title: 'THE ZEN MASTER',
    emoji: '🟢',
    subtitle: 'Somehow you\'re functioning like a normal human being. Suspicious.',
    color: '#00FF9C',
    advice: [
      'System nominal. No intervention required. You are suspiciously functional.',
      'Recommendation: Continue existing. You are performing above expected parameters.',
      'Warning: Dangerously well-rested. Other humans may become suspicious.',
      'Keep doing... whatever it is you\'re doing. The rest of us need to study you.',
    ],
    verdictGif: 'zen meditation peaceful calm relaxed',
  },
  {
    tier: 'seasoned',
    minScore: 21,
    maxScore: 40,
    title: 'SLIGHTLY SEASONED',
    emoji: '🟡',
    subtitle: 'You\'re stressed, but still operational. Barely.',
    color: '#c4b5fd',
    advice: [
      'Recommendation: Schedule 1 (one) nap. Execute: NapProtocol.init()',
      'Consider reducing screen brightness. Your retinas filed a complaint.',
      'Mild stress detected. Nothing a questionable amount of snacks can\'t fix.',
      'System suggestion: Pet a dog. Any dog. Immediately.',
    ],
    verdictGif: 'slightly worried nervous smile sweating',
  },
  {
    tier: 'medium',
    minScore: 41,
    maxScore: 60,
    title: 'MEDIUM COOKED',
    emoji: '🟠',
    subtitle: 'You\'re keeping it together through questionable amounts of caffeine and denial.',
    color: '#ff7a17',
    advice: [
      'Your brain has requested a reboot. Please comply within 24 hours.',
      'Recommendation: Close 47 of your 50 browser tabs. Keep the music one.',
      'Warning: Burnout trajectory detected. Countermeasure: do literally nothing for 1 hour.',
      'Go outside. Drink water. Sleep. Stop opening new tabs.',
    ],
    verdictGif: 'this is fine fire everything burning',
  },
  {
    tier: 'cooked',
    minScore: 61,
    maxScore: 80,
    title: 'VERY COOKED',
    emoji: '🔴',
    subtitle: 'Your brain has approximately 37 tabs open and at least 12 are playing audio.',
    color: '#FF4D4D',
    advice: [
      'CRITICAL: Execute TouchGrass() immediately. This is not a suggestion.',
      'Your stress levels have exceeded the warranty. We are not liable for further damage.',
      'Emergency protocol: Step away from ALL screens. Yes, including this one.',
      'Alert: Your coping mechanism of "I\'m fine" has been deprecated.',
    ],
    verdictGif: 'stressed out overwhelmed chaos panic computer',
  },
  {
    tier: 'nuclear',
    minScore: 81,
    maxScore: 100,
    title: 'ABSOLUTELY COOKED',
    emoji: '💀',
    subtitle: 'You don\'t need another productivity hack. You need to STOP.',
    color: '#FF0040',
    advice: [
      'MAYDAY MAYDAY. All systems critical. Deploy emergency self-care or accept your fate.',
      'You are now running on pure spite and caffeine. Godspeed.',
      'Recommendation: Have you tried turning yourself off and back on again?',
      'Your burnout level has achieved sentience. It is now filing its own complaints.',
    ],
    verdictGif: 'nuclear explosion catastrophe disaster skull',
  },
];

/**
 * Get the diagnosis for a given score.
 * @param {number} score — 0–100
 * @returns {Object} diagnosis object
 */
export function getDiagnosis(score) {
  const clamped = Math.max(0, Math.min(100, score));
  for (const d of diagnoses) {
    if (clamped >= d.minScore && clamped <= d.maxScore) {
      return d;
    }
  }
  return diagnoses[diagnoses.length - 1];
}

/**
 * Get a random piece of advice for the given diagnosis.
 * @param {Object} diagnosis — a diagnosis object from getDiagnosis()
 * @returns {string}
 */
export function getRandomAdvice(diagnosis) {
  const pool = diagnosis.advice;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Category display labels */
export const categoryLabels = {
  work: 'Workload',
  sleep: 'Sleep',
  mental: 'Mental Load',
  social: 'Social Energy',
  physical: 'Physical',
  coping: 'Coping',
};

export default diagnoses;
