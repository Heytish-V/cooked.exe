/**
 * sound.js — Sound effects using Web Speech API and Web Audio API
 *
 * No external audio files needed. All sounds are generated programmatically.
 * Sounds are gated behind user interaction to comply with browser autoplay policies.
 */

let audioCtx = null;
let hasInteracted = false;

/** Mark that the user has interacted (call on first click/tap) */
export function markInteraction() {
  hasInteracted = true;
}

/** Get or create the AudioContext (lazy init after user interaction) */
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Speak text using the Web Speech API.
 * @param {string} text — text to speak
 * @param {Object} options — optional overrides
 * @param {number} options.rate — speech rate (default 0.9)
 * @param {number} options.pitch — speech pitch (default 0.8)
 */
export function speak(text, { rate = 0.9, pitch = 0.8 } = {}) {
  if (!hasInteracted) return;
  if (!('speechSynthesis' in window)) return;

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 0.7;

    // Try to use a robotic-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Daniel')
    );
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis failed:', e);
  }
}

/**
 * Play a warning alarm beep using the Web Audio API.
 * Generates a dual-tone alarm that plays for ~2 seconds.
 */
export function playAlarm() {
  if (!hasInteracted) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create two oscillators for a dual-tone alarm
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.value = i % 2 === 0 ? 880 : 660;

      gain.gain.setValueAtTime(0.08, now + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.25);

      osc.start(now + i * 0.3);
      osc.stop(now + i * 0.3 + 0.3);
    }
  } catch (e) {
    console.warn('Alarm playback failed:', e);
  }
}

/**
 * Play a short "blip" confirmation sound.
 */
export function playBlip() {
  if (!hasInteracted) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.warn('Blip playback failed:', e);
  }
}

/**
 * Play a success/celebration chime.
 */
export function playSuccess() {
  if (!hasInteracted) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.06, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.35);
    });
  } catch (e) {
    console.warn('Success chime failed:', e);
  }
}
