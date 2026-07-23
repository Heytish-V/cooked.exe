# 🔥 How Cooked Am I? — AI Burnout Diagnostic

A futuristic AI diagnostic scanner that humorously rates your burnout level (0–100) through an immersive, animated interface resembling a sentient AI operating system.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Boot Sequence** — Animated initialization with radar sweep, progress bar, and system log
- **15 Diagnostic Questions** — Humorous multiple-choice questions about sleep, caffeine, deadlines, and more
- **Scanning Animation** — Fake diagnostic scan with live telemetry bars
- **Full Diagnostic Report** — Score (0–100), cooked level, diagnostics, telemetry charts, and recommendations
- **Voice & Sound** — TTS diagnostics via Web Speech API, alarm beeps via Web Audio API
- **Easter Eggs** — Special messages for extreme scores, caffeine overdose, and more
- **Confetti** — Celebration animation for low-stress scores
- **Share** — Web Share API + clipboard fallback
- **Responsive** — Fully responsive on desktop and mobile
- **No External Audio Files** — All sounds generated programmatically

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:3000` by default.

## 🎨 Customization

### Colors

Edit CSS custom properties in `src/index.css`:

```css
:root {
  --bg-dark: #05070A;
  --panel: #0F1720;
  --cyan: #00E5FF;
  --orange: #FF9E2C;
  --red: #FF4D4D;
  --green: #00FF9C;
}
```

### Fonts

Change font families in `src/index.css` and update the Google Fonts `<link>` in `index.html`:

```css
:root {
  --font-display: 'Orbitron', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Space Grotesk', sans-serif;
}
```

### Questions

Edit `src/data/questions.js`. Each question has:
- `id` — unique identifier (used to map answers to diagnostics)
- `label` — "SYSTEM CHECK" category label
- `question` — the question text
- `options` — array of `{ text, weight }` where weight is 0–5

### Advice / Recommendations

Edit `src/data/advice.js`. Organized by score tier: `fresh`, `mild`, `medium`, `deep`, `cooked`, `beyond`.

### Diagnostics

Edit `src/data/diagnostics.js`. Each item maps a question ID + weight threshold to a detected issue.

### Cooked Level Thresholds

Edit `src/utils/scoring.js` → `getCookedLevel()` function:

```js
if (score <= 20) return { label: 'FRESHLY COMPILED', ... };
if (score <= 40) return { label: 'MILDLY TOASTED', ... };
// etc.
```

### Telemetry Metrics

Edit `src/utils/scoring.js` → `generateTelemetry()` function to add/remove/modify telemetry bars.

### Easter Eggs

Edit `src/utils/scoring.js` → `getEasterEggs()` function.

## 📁 Project Structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Main state machine (4 screens)
├── index.css                 # Global design system
├── screens/
│   ├── BootScreen.jsx/css    # Initialization sequence
│   ├── QuestionScreen.jsx/css # Question display
│   ├── ScanningScreen.jsx/css # Fake diagnostic scan
│   └── ResultsScreen.jsx/css  # Full diagnostic report
├── components/
│   ├── ParticleBackground.jsx # Canvas floating particles
│   ├── GridBackground.jsx     # CSS grid pattern
│   ├── ScanlineOverlay.jsx    # CRT scanline effect
│   ├── GlowBar.jsx           # Animated progress bar
│   └── TypewriterText.jsx     # Typewriter text reveal
├── data/
│   ├── questions.js           # 15 diagnostic questions
│   ├── advice.js              # Humorous recommendations
│   └── diagnostics.js         # Diagnostic check definitions
└── utils/
    ├── scoring.js             # Score calculation & telemetry
    └── sound.js               # Web Speech/Audio API sounds
```

## 🎮 Cooked Level Scale

| Score | Level | Color |
|-------|-------|-------|
| 0–20 | Freshly Compiled | 🟢 Green |
| 21–40 | Mildly Toasted | 🟢 Light Green |
| 41–60 | Medium Rare | 🟠 Orange |
| 61–80 | Deep Fried | 🔴 Red-Orange |
| 81–95 | Absolutely Cooked | 🔴 Red |
| 96–100 | Beyond Recovery | 🔴 Hot Red |

## 🥚 Easter Eggs

- **Score = 100**: "ERROR: INTEGER OVERFLOW"
- **Score > 95**: "Achievement Unlocked: Beyond Recovery"
- **Score ≥ 90**: "KERNEL PANIC: User.exe has stopped responding"
- **Extreme Coffee (6+ cups)**: "You are now legally espresso"
- **Procrastinating + Burning Deadline**: "Achievement Unlocked: Procrastinating with a burning deadline"
- **Zero Social Battery + Existential Crisis**: "Achievement Unlocked: Existential Hermit Mode"
- **Score = 0**: "ANOMALY DETECTED: Subject appears to be... happy?"
- **Score ≤ 10**: "You are disturbingly well-adjusted"

## 📱 Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool
- **Framer Motion** — Animations & transitions
- **Recharts** — Telemetry charts
- **canvas-confetti** — Celebration effects
- **Web Speech API** — Text-to-speech
- **Web Audio API** — Alarm sounds

## 📄 License

MIT — Use it, fork it, deploy it, share it. Have fun! 🎉
