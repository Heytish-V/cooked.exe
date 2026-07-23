import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from '../data/questions';
import { playBlip, markInteraction } from '../utils/sound';
import './QuestionScreen.css';

/**
 * Meme search keywords per question ID — maps each question to funny,
 * meme-relevant search terms for each answer weight tier.
 * Format: { questionId: { low: 'keyword', mid: 'keyword', high: 'keyword', max: 'keyword' } }
 */
const memeKeywords = {
  sleep:         { low: 'well rested happy', mid: 'tired sleepy', high: 'no sleep zombie', max: 'insomnia meme funny' },
  caffeine:      { low: 'water healthy', mid: 'coffee morning', high: 'too much coffee', max: 'caffeine overdose meme' },
  deadlines:     { low: 'relaxed chill', mid: 'deadline stress', high: 'deadline panic', max: 'everything is fine fire meme' },
  screentime:    { low: 'touching grass outside', mid: 'screen time', high: 'glued to screen', max: 'screen addiction meme' },
  meals:         { low: 'healthy food', mid: 'forgot to eat', high: 'skipping meals', max: 'coffee is food meme' },
  exercise:      { low: 'gym workout', mid: 'exercise lazy', high: 'no exercise couch', max: 'walking to fridge exercise meme' },
  socialbattery: { low: 'extrovert party', mid: 'introvert recharge', high: 'social anxiety', max: 'social battery dead meme' },
  motivation:    { low: 'motivated hustle', mid: 'autopilot mode', high: 'no motivation', max: 'motivation left the chat meme' },
  procrastination:{ low: 'productive focused', mid: 'procrastinating a little', high: 'procrastination meme', max: 'procrastinating with deadlines meme' },
  mentalstate:   { low: 'zen peaceful', mid: 'brain tabs open', high: 'mental chaos', max: 'too many browser tabs meme' },
  lastbreak:     { low: 'vacation relaxing', mid: 'need a break', high: 'burnout meme', max: 'what is a break meme' },
  coping:        { low: 'healthy hobby', mid: 'comfort show', high: 'doom scrolling meme', max: 'staring into void meme' },
  emails:        { low: 'inbox zero', mid: 'unread emails', high: 'email overload', max: 'inbox overflow meme' },
  existential:   { low: 'happy content', mid: 'existential crisis', high: 'meaning of life meme', max: 'continuous existential crisis meme' },
  impostor:      { low: 'confident boss', mid: 'self doubt', high: 'impostor syndrome meme', max: 'stack overflow developer meme' },
};

/**
 * Pick a meme search keyword based on the question id and option weight.
 */
function getMemeSearchTerm(questionId, weight) {
  const kw = memeKeywords[questionId];
  if (!kw) return 'funny reaction meme';
  if (weight <= 0) return kw.low;
  if (weight <= 1) return kw.mid;
  if (weight <= 3) return kw.high;
  return kw.max;
}

/**
 * QuestionScreen — Displays questions one at a time with animated transitions.
 *
 * @param {function} onComplete — called with answers object when all questions answered
 */
export default function QuestionScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [memeUrl, setMemeUrl] = useState(null);
  const [memeLoading, setMemeLoading] = useState(false);

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPct = Math.round(((currentIndex) / totalQuestions) * 100);
  const filled = Math.floor((currentIndex / totalQuestions) * 20);
  const empty = 20 - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

  /**
   * Advance to the next question (or finish).
   */
  const advance = (optionIndex) => {
    const newAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(newAnswers);
    setSelectedOption(null);
    setMemeUrl(null);
    setMemeLoading(false);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleSelect = async (optionIndex) => {
    markInteraction();
    playBlip();
    setSelectedOption(optionIndex);
    setMemeLoading(true);
    setMemeUrl(null);

    const option = question.options[optionIndex];
    const searchTerm = getMemeSearchTerm(question.id, option.weight);

    // Giphy API (free public beta key, confirmed working)
    // Override with Tenor: set VITE_TENOR_API_KEY in .env
    const tenorKey = import.meta.env.VITE_TENOR_API_KEY;
    let endpoint;
    let isTenor = false;

    if (tenorKey) {
      // User supplied their own Tenor v2 key
      isTenor = true;
      endpoint = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${tenorKey}&client_key=how_cooked_am_i&limit=8&media_filter=gif`;
    } else {
      // Default: Giphy API with public beta key
      const giphyKey = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';
      endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(searchTerm)}&limit=8&rating=pg`;
    }

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        const results = data.results || data.data || [];
        if (results.length > 0) {
          // Pick a random result from the top 8 for variety
          const pick = results[Math.floor(Math.random() * results.length)];
          let gifUrl;
          if (isTenor) {
            gifUrl = pick?.media_formats?.tinygif?.url || pick?.media_formats?.gif?.url || null;
          } else {
            // Giphy: use fixed_height for good quality at reasonable size
            gifUrl = pick?.images?.fixed_height?.url || pick?.images?.original?.url || null;
          }
          if (gifUrl) {
            setMemeUrl(gifUrl);
            setMemeLoading(false);
            // Show the meme for 2.5 seconds, then advance
            setTimeout(() => advance(optionIndex), 2500);
            return; // early return — advance is scheduled
          }
        }
      }
    } catch (e) {
      console.warn('GIF API fetch failed:', e);
    }

    // If we get here, the fetch failed or returned no results — advance quickly
    setMemeLoading(false);
    setTimeout(() => advance(optionIndex), 500);
  };

  return (
    <motion.div
      className="question-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="question-screen__container">
        {/* Header */}
        <div className="question-screen__header">
          <div className="question-screen__header-left">
            <span className="question-screen__badge">DIAGNOSTIC SCAN</span>
            <span className="question-screen__counter">
              QUERY {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <div className="question-screen__progress-text">
            <span className="question-screen__progress-bar-text">{progressBar}</span>
            <span className="question-screen__progress-pct">{progressPct}%</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="question-screen__card"
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* System check label */}
            <div className="question-screen__label">
              <span className="question-screen__label-icon">◈</span>
              SYSTEM CHECK: {question.label}
            </div>

            {/* Question text */}
            <h2 className="question-screen__question">{question.question}</h2>

            {/* Options */}
            <div className="question-screen__options">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  className={`question-screen__option ${selectedOption === i ? 'question-screen__option--selected' : ''}`}
                  onClick={() => handleSelect(i)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedOption !== null}
                >
                  <span className="question-screen__option-radio">
                    {selectedOption === i ? '◉' : '○'}
                  </span>
                  <span className="question-screen__option-text">{option.text}</span>
                </motion.button>
              ))}
            </div>

            {/* Meme Loading Indicator */}
            {memeLoading && (
              <div className="question-screen__meme-loading">
                <span className="question-screen__meme-loading-icon">◈</span>
                FETCHING REACTION DATA...
              </div>
            )}

            {/* Meme Display */}
            <AnimatePresence>
              {memeUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.2rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="question-screen__meme-container"
                >
                  <div className="question-screen__meme-label">⚡ SYSTEM REACTION</div>
                  <img src={memeUrl} alt="Reaction meme" className="question-screen__meme" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Bottom status */}
        <div className="question-screen__status">
          <span className="question-screen__status-dot" /> LIVE SCAN IN PROGRESS
        </div>
      </div>
    </motion.div>
  );
}
