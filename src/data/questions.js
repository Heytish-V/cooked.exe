/**
 * questions.js — All 15 diagnostic questions
 *
 * Each question has:
 *   - id: unique identifier (used to map answers to diagnostics)
 *   - label: the "SYSTEM CHECK" category label
 *   - question: the humorous question text
 *   - options: array of { text, weight } where weight is 0–5
 *
 * To customize: add/remove/reorder questions. Keep weights 0–5.
 * The scoring algorithm normalizes to 0–100 regardless of question count.
 */

const questions = [
  {
    id: 'sleep',
    label: 'SLEEP SUBSYSTEM',
    question: 'How many hours of sleep did you get last night?',
    options: [
      { text: '8+ hours (I am a mythical creature)', weight: 0 },
      { text: '6–7 hours (functioning adult)', weight: 1 },
      { text: '4–5 hours (getting risky)', weight: 3 },
      { text: 'Sleep is a social construct', weight: 5 },
    ],
  },
  {
    id: 'caffeine',
    label: 'CAFFEINE INTAKE MODULE',
    question: 'How many cups of coffee/energy drinks today?',
    options: [
      { text: 'None (water drinker energy)', weight: 0 },
      { text: '1–2 cups (normal human)', weight: 1 },
      { text: '3–5 cups (caffeinated warrior)', weight: 3 },
      { text: '6+ cups (legally espresso)', weight: 5 },
    ],
  },
  {
    id: 'deadlines',
    label: 'DEADLINE PROXIMITY SENSOR',
    question: 'How many deadlines are breathing down your neck?',
    options: [
      { text: 'None — I am at peace', weight: 0 },
      { text: '1–2 (manageable chaos)', weight: 1 },
      { text: '3–5 (controlled demolition)', weight: 3 },
      { text: 'We don\'t talk about that', weight: 5 },
    ],
  },
  {
    id: 'screentime',
    label: 'SCREEN RADIATION DETECTOR',
    question: 'How many hours of screen time today?',
    options: [
      { text: 'Under 2 hours (touched grass)', weight: 0 },
      { text: '2–5 hours (moderate exposure)', weight: 1 },
      { text: '6–10 hours (becoming the screen)', weight: 3 },
      { text: '10+ hours (one with the void)', weight: 5 },
    ],
  },
  {
    id: 'meals',
    label: 'NUTRITION INTAKE SCANNER',
    question: 'How many proper meals have you eaten today?',
    options: [
      { text: '3 balanced meals (actual adult)', weight: 0 },
      { text: '2 meals (could be worse)', weight: 1 },
      { text: '1 meal (survival mode)', weight: 3 },
      { text: 'Does coffee count as a meal?', weight: 5 },
    ],
  },
  {
    id: 'exercise',
    label: 'PHYSICAL ACTIVITY MONITOR',
    question: 'When did you last exercise?',
    options: [
      { text: 'Today (absolute machine)', weight: 0 },
      { text: 'This week (trying)', weight: 1 },
      { text: 'This month (optimistic)', weight: 3 },
      { text: 'I walked to the fridge, does that count?', weight: 5 },
    ],
  },
  {
    id: 'socialbattery',
    label: 'SOCIAL BATTERY GAUGE',
    question: 'How is your social battery right now?',
    options: [
      { text: 'Fully charged — bring on the humans', weight: 0 },
      { text: 'Half charged — selective socializing', weight: 1 },
      { text: 'Low — texts give me anxiety', weight: 3 },
      { text: 'Error 404: Social skills not found', weight: 5 },
    ],
  },
  {
    id: 'motivation',
    label: 'MOTIVATION ENGINE STATUS',
    question: 'How motivated do you feel right now?',
    options: [
      { text: 'Ready to conquer the world', weight: 0 },
      { text: 'Moderately motivated (autopilot)', weight: 1 },
      { text: 'Running on fumes and spite', weight: 3 },
      { text: 'My motivation filed a restraining order', weight: 5 },
    ],
  },
  {
    id: 'procrastination',
    label: 'PROCRASTINATION DETECTOR',
    question: 'Are you procrastinating right now by taking this quiz?',
    options: [
      { text: 'No, I have free time genuinely', weight: 0 },
      { text: 'Maybe a little...', weight: 2 },
      { text: 'Absolutely yes', weight: 4 },
      { text: 'I have 3 tabs of assignments open right now', weight: 5 },
    ],
  },
  {
    id: 'mentalstate',
    label: 'MENTAL STATE ANALYZER',
    question: 'If your brain were a browser, how many tabs are open?',
    options: [
      { text: '1–5 tabs (zen master)', weight: 0 },
      { text: '6–15 tabs (normal chaos)', weight: 1 },
      { text: '16–50 tabs (organized mess)', weight: 3 },
      { text: '50+ tabs and 3 are playing music', weight: 5 },
    ],
  },
  {
    id: 'lastbreak',
    label: 'REST CYCLE ANALYZER',
    question: 'When was your last proper break or day off?',
    options: [
      { text: 'Today / yesterday (self-care queen)', weight: 0 },
      { text: 'This week (reasonable)', weight: 1 },
      { text: 'Can\'t remember (uh oh)', weight: 3 },
      { text: 'What is a "break"?', weight: 5 },
    ],
  },
  {
    id: 'coping',
    label: 'COPING MECHANISM AUDIT',
    question: 'What\'s your primary coping mechanism right now?',
    options: [
      { text: 'Healthy hobbies and exercise', weight: 0 },
      { text: 'Music and comfort shows', weight: 1 },
      { text: 'Doom scrolling at 3 AM', weight: 3 },
      { text: 'Staring into the void (it stares back)', weight: 5 },
    ],
  },
  {
    id: 'emails',
    label: 'INBOX OVERFLOW DETECTOR',
    question: 'How many unread messages/emails do you have?',
    options: [
      { text: 'Inbox zero (teach me your ways)', weight: 0 },
      { text: '1–20 (manageable)', weight: 1 },
      { text: '20–100 (it\'s fine, this is fine)', weight: 3 },
      { text: '100+ (inbox is a graveyard)', weight: 5 },
    ],
  },
  {
    id: 'existential',
    label: 'EXISTENTIAL CRISIS METER',
    question: 'How many existential crises have you had this week?',
    options: [
      { text: 'Zero — I know my purpose', weight: 0 },
      { text: '1 (brief contemplation)', weight: 1 },
      { text: '2–3 (standard issue)', weight: 3 },
      { text: 'It\'s one continuous crisis', weight: 5 },
    ],
  },
  {
    id: 'impostor',
    label: 'IMPOSTOR SYNDROME SCANNER',
    question: 'Do you feel like you know what you\'re doing?',
    options: [
      { text: 'Yes, I\'m competent and confident', weight: 0 },
      { text: 'Mostly, with occasional doubt', weight: 1 },
      { text: 'I\'m winging it and everyone knows', weight: 3 },
      { text: 'I\'m a stack overflow answer in human form', weight: 5 },
    ],
  },
];

export default questions;
