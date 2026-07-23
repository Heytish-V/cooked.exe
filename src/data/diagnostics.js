/**
 * diagnostics.js — Diagnostic check items for the results panel
 *
 * Each diagnostic maps to a question ID and a weight threshold.
 * If the user's answer weight for that question meets/exceeds the threshold,
 * the diagnostic is "detected" (shown with a warning icon).
 * Otherwise it shows as "clear" (checkmark).
 *
 * type: 'warning' items show ⚠ when triggered, 'check' items show ✔ when triggered
 */

const diagnostics = [
  { id: 'sleep_deficiency', label: 'Sleep Deficiency', questionId: 'sleep', threshold: 3, type: 'warning' },
  { id: 'caffeine_overdose', label: 'Caffeine Overdose', questionId: 'caffeine', threshold: 3, type: 'warning' },
  { id: 'deadline_overload', label: 'Deadline Overload', questionId: 'deadlines', threshold: 3, type: 'warning' },
  { id: 'screen_radiation', label: 'Screen Radiation Exposure', questionId: 'screentime', threshold: 3, type: 'warning' },
  { id: 'nutrition_failure', label: 'Nutrition Module Failure', questionId: 'meals', threshold: 3, type: 'warning' },
  { id: 'physical_atrophy', label: 'Physical Activity Atrophy', questionId: 'exercise', threshold: 3, type: 'warning' },
  { id: 'social_battery', label: 'Social Battery Depleted', questionId: 'socialbattery', threshold: 3, type: 'warning' },
  { id: 'motivation_leak', label: 'Motivation Memory Leak', questionId: 'motivation', threshold: 3, type: 'warning' },
  { id: 'procrastination', label: 'Procrastination Loop Detected', questionId: 'procrastination', threshold: 2, type: 'warning' },
  { id: 'tab_overflow', label: 'Browser Tab Overflow', questionId: 'mentalstate', threshold: 3, type: 'warning' },
  { id: 'rest_deficit', label: 'Rest Cycle Deficit', questionId: 'lastbreak', threshold: 3, type: 'warning' },
  { id: 'coping_failure', label: 'Coping Mechanism Failure', questionId: 'coping', threshold: 3, type: 'warning' },
  { id: 'inbox_overflow', label: 'Inbox Stack Overflow', questionId: 'emails', threshold: 3, type: 'warning' },
  { id: 'existential_leak', label: 'Existential Thread Leak', questionId: 'existential', threshold: 3, type: 'warning' },
  { id: 'impostor_syndrome', label: 'Impostor Syndrome Active', questionId: 'impostor', threshold: 3, type: 'warning' },
];

export default diagnostics;
