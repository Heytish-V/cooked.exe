/**
 * questions.js — Categorized stress diagnostic question pool
 *
 * ~25 questions across 6 categories. The question selector picks 10 per session
 * (at least 1 from each category + 4 random fills) for replayability.
 *
 * Each option has:
 *   - text: the answer label
 *   - weight: 0–5 scoring weight
 *   - tier: 'zen' | 'mild' | 'cooked' | 'nuclear' — maps to reaction severity
 */

const questions = [
  // ─── WORK / COLLEGE ───────────────────────────────────────
  {
    id: 'procrastination',
    category: 'work',
    label: 'PROCRASTINATION DETECTOR',
    question: 'How often do you procrastinate even when you know something is due?',
    options: [
      { text: 'Never — I am terrifyingly disciplined', weight: 0, tier: 'zen' },
      { text: 'Sometimes, but I recover', weight: 1, tier: 'mild' },
      { text: 'Often enough to be a personality trait', weight: 3, tier: 'cooked' },
      { text: '"I\'ll deal with it tomorrow" × 47', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'deadlines',
    category: 'work',
    label: 'DEADLINE PROXIMITY SENSOR',
    question: 'How many deadlines are breathing down your neck right now?',
    options: [
      { text: 'None — I am at peace', weight: 0, tier: 'zen' },
      { text: '1–2 (manageable chaos)', weight: 1, tier: 'mild' },
      { text: '3–5 (controlled demolition)', weight: 3, tier: 'cooked' },
      { text: 'We don\'t talk about that', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'emails',
    category: 'work',
    label: 'INBOX OVERFLOW DETECTOR',
    question: 'How many unread messages / emails do you have?',
    options: [
      { text: 'Inbox zero (teach me your ways)', weight: 0, tier: 'zen' },
      { text: '1–20 (manageable)', weight: 1, tier: 'mild' },
      { text: '20–100 (it\'s fine, this is fine)', weight: 3, tier: 'cooked' },
      { text: '100+ (inbox is a graveyard)', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'workswitch',
    category: 'work',
    label: 'SHUTDOWN PROTOCOL',
    question: 'Do you struggle to switch off after work / college?',
    options: [
      { text: 'Nope, I close the laptop and forget it exists', weight: 0, tier: 'zen' },
      { text: 'Sometimes I check one more thing...', weight: 1, tier: 'mild' },
      { text: 'My brain keeps running tasks in the background', weight: 3, tier: 'cooked' },
      { text: 'There is no "after work" — only work', weight: 5, tier: 'nuclear' },
    ],
  },

  // ─── SLEEP ────────────────────────────────────────────────
  {
    id: 'sleep_hours',
    category: 'sleep',
    label: 'SLEEP SUBSYSTEM',
    question: 'How many hours do you *actually* sleep?',
    options: [
      { text: '8+ hours (mythical creature)', weight: 0, tier: 'zen' },
      { text: '6–7 hours (functioning adult)', weight: 1, tier: 'mild' },
      { text: '4–5 hours (getting risky)', weight: 3, tier: 'cooked' },
      { text: 'Sleep is a social construct', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'wake_tired',
    category: 'sleep',
    label: 'BOOT-UP DIAGNOSTICS',
    question: 'Do you wake up already feeling tired?',
    options: [
      { text: 'No — I wake up refreshed like a Disney character', weight: 0, tier: 'zen' },
      { text: 'Sometimes, depends on the day', weight: 1, tier: 'mild' },
      { text: 'Most mornings feel like a system crash', weight: 3, tier: 'cooked' },
      { text: 'I don\'t wake up. I just resume suffering.', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'sleep_thoughts',
    category: 'sleep',
    label: 'NIGHT MODE PROCESSOR',
    question: 'What happens when you try to fall asleep?',
    options: [
      { text: 'Out like a light within 10 minutes', weight: 0, tier: 'zen' },
      { text: 'A little tossing and turning, nothing major', weight: 1, tier: 'mild' },
      { text: 'My brain replays every mistake I\'ve ever made', weight: 3, tier: 'cooked' },
      { text: '3 AM existential crisis speedrun', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'sleep_schedule',
    category: 'sleep',
    label: 'CIRCADIAN INTEGRITY',
    question: 'How consistent is your sleep schedule?',
    options: [
      { text: 'Same time every night like clockwork', weight: 0, tier: 'zen' },
      { text: 'Roughly consistent, give or take an hour', weight: 1, tier: 'mild' },
      { text: 'What schedule? I sleep when I collapse', weight: 3, tier: 'cooked' },
      { text: 'My body doesn\'t know what timezone it\'s in', weight: 5, tier: 'nuclear' },
    ],
  },

  // ─── MENTAL LOAD ──────────────────────────────────────────
  {
    id: 'mental_tabs',
    category: 'mental',
    label: 'MENTAL STATE ANALYZER',
    question: 'If your brain were a browser, how many tabs are open?',
    options: [
      { text: '1–5 tabs (zen master)', weight: 0, tier: 'zen' },
      { text: '6–15 tabs (normal chaos)', weight: 1, tier: 'mild' },
      { text: '16–50 tabs (organized mess)', weight: 3, tier: 'cooked' },
      { text: '50+ tabs and at least 3 are playing audio', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'unfinished_tasks',
    category: 'mental',
    label: 'BACKGROUND PROCESS MONITOR',
    question: 'Do you think about unfinished tasks while trying to relax?',
    options: [
      { text: 'No — when I relax, I actually relax', weight: 0, tier: 'zen' },
      { text: 'Occasionally, but I can let it go', weight: 1, tier: 'mild' },
      { text: 'The tasks follow me into my hobbies', weight: 3, tier: 'cooked' },
      { text: 'Relaxation is just guilt with extra steps', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'existential',
    category: 'mental',
    label: 'EXISTENTIAL CRISIS METER',
    question: 'How many existential crises have you had this week?',
    options: [
      { text: 'Zero — I know my purpose', weight: 0, tier: 'zen' },
      { text: '1 (brief contemplation)', weight: 1, tier: 'mild' },
      { text: '2–3 (standard issue)', weight: 3, tier: 'cooked' },
      { text: 'It\'s one continuous crisis', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'impostor',
    category: 'mental',
    label: 'IMPOSTOR SYNDROME SCANNER',
    question: 'Do you feel like you know what you\'re doing?',
    options: [
      { text: 'Yes — I\'m competent and confident', weight: 0, tier: 'zen' },
      { text: 'Mostly, with occasional doubt', weight: 1, tier: 'mild' },
      { text: 'I\'m winging it and everyone can tell', weight: 3, tier: 'cooked' },
      { text: 'I\'m a Stack Overflow answer in human form', weight: 5, tier: 'nuclear' },
    ],
  },

  // ─── SOCIAL ───────────────────────────────────────────────
  {
    id: 'social_battery',
    category: 'social',
    label: 'SOCIAL BATTERY GAUGE',
    question: 'How is your social battery right now?',
    options: [
      { text: 'Fully charged — bring on the humans', weight: 0, tier: 'zen' },
      { text: 'Half charged — selective socializing', weight: 1, tier: 'mild' },
      { text: 'Low — texts give me anxiety', weight: 3, tier: 'cooked' },
      { text: 'Error 404: Social skills not found', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'social_drain',
    category: 'social',
    label: 'INTERACTION ENERGY ANALYZER',
    question: 'Do you feel drained after talking to people?',
    options: [
      { text: 'No — people energize me', weight: 0, tier: 'zen' },
      { text: 'Depends on who it is', weight: 1, tier: 'mild' },
      { text: 'Most conversations feel like a boss fight', weight: 3, tier: 'cooked' },
      { text: 'I need 3 business days to recover from a phone call', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'isolation',
    category: 'social',
    label: 'ISOLATION INDEX',
    question: 'When was the last time you genuinely enjoyed hanging out with someone?',
    options: [
      { text: 'Today or yesterday', weight: 0, tier: 'zen' },
      { text: 'This week', weight: 1, tier: 'mild' },
      { text: 'Can\'t really remember...', weight: 3, tier: 'cooked' },
      { text: 'My last meaningful interaction was with a chatbot', weight: 5, tier: 'nuclear' },
    ],
  },

  // ─── PHYSICAL ─────────────────────────────────────────────
  {
    id: 'exercise',
    category: 'physical',
    label: 'PHYSICAL ACTIVITY MONITOR',
    question: 'When did you last exercise?',
    options: [
      { text: 'Today (absolute machine)', weight: 0, tier: 'zen' },
      { text: 'This week (trying)', weight: 1, tier: 'mild' },
      { text: 'This month (optimistic)', weight: 3, tier: 'cooked' },
      { text: 'I walked to the fridge — does that count?', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'meals',
    category: 'physical',
    label: 'NUTRITION INTAKE SCANNER',
    question: 'How many proper meals have you eaten today?',
    options: [
      { text: '3 balanced meals (actual adult)', weight: 0, tier: 'zen' },
      { text: '2 meals (could be worse)', weight: 1, tier: 'mild' },
      { text: '1 meal (survival mode)', weight: 3, tier: 'cooked' },
      { text: 'Does coffee count as a meal?', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'caffeine',
    category: 'physical',
    label: 'CAFFEINE INTAKE MODULE',
    question: 'How many cups of coffee / energy drinks today?',
    options: [
      { text: 'None (water drinker energy)', weight: 0, tier: 'zen' },
      { text: '1–2 cups (normal human)', weight: 1, tier: 'mild' },
      { text: '3–5 cups (caffeinated warrior)', weight: 3, tier: 'cooked' },
      { text: '6+ cups (legally espresso)', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'screentime',
    category: 'physical',
    label: 'SCREEN RADIATION DETECTOR',
    question: 'How many hours of screen time today?',
    options: [
      { text: 'Under 2 hours (touched grass)', weight: 0, tier: 'zen' },
      { text: '2–5 hours (moderate exposure)', weight: 1, tier: 'mild' },
      { text: '6–10 hours (becoming the screen)', weight: 3, tier: 'cooked' },
      { text: '10+ hours (one with the void)', weight: 5, tier: 'nuclear' },
    ],
  },

  // ─── COPING ───────────────────────────────────────────────
  {
    id: 'coping_style',
    category: 'coping',
    label: 'COPING MECHANISM AUDIT',
    question: 'When you\'re stressed, what do you usually do?',
    options: [
      { text: 'Healthy hobbies and exercise', weight: 0, tier: 'zen' },
      { text: 'Music and comfort shows', weight: 1, tier: 'mild' },
      { text: 'Doom scrolling at 3 AM', weight: 3, tier: 'cooked' },
      { text: 'Staring into the void (it stares back)', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'ignore_stress',
    category: 'coping',
    label: 'DENIAL ENGINE',
    question: 'When you\'re stressed, do you usually just ignore it and keep going?',
    options: [
      { text: 'No — I address it and take breaks', weight: 0, tier: 'zen' },
      { text: 'Sometimes I push through, then rest', weight: 1, tier: 'mild' },
      { text: 'I pretend it doesn\'t exist until I crash', weight: 3, tier: 'cooked' },
      { text: '"This is fine" is my operating system', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'last_break',
    category: 'coping',
    label: 'REST CYCLE ANALYZER',
    question: 'When was your last proper break or day off?',
    options: [
      { text: 'Today / yesterday (self-care energy)', weight: 0, tier: 'zen' },
      { text: 'This week (reasonable)', weight: 1, tier: 'mild' },
      { text: 'Can\'t remember (uh oh)', weight: 3, tier: 'cooked' },
      { text: 'What is a "break"?', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'motivation',
    category: 'coping',
    label: 'MOTIVATION ENGINE STATUS',
    question: 'How motivated do you feel right now?',
    options: [
      { text: 'Ready to conquer the world', weight: 0, tier: 'zen' },
      { text: 'Moderately motivated (autopilot)', weight: 1, tier: 'mild' },
      { text: 'Running on fumes and spite', weight: 3, tier: 'cooked' },
      { text: 'My motivation filed a restraining order', weight: 5, tier: 'nuclear' },
    ],
  },
  {
    id: 'quiz_meta',
    category: 'coping',
    label: 'META AWARENESS CHECK',
    question: 'Are you procrastinating right now by taking this quiz?',
    options: [
      { text: 'No, I genuinely have free time', weight: 0, tier: 'zen' },
      { text: 'Maybe a little...', weight: 2, tier: 'mild' },
      { text: 'Absolutely yes', weight: 4, tier: 'cooked' },
      { text: 'I have 3 tabs of assignments open right now', weight: 5, tier: 'nuclear' },
    ],
  },
];

export default questions;
