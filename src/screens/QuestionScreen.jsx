/**
 * QuizScreen — The core Question → Answer → Reaction → Next loop
 *
 * State machine per question:
 *   1. 'asking'       → show question + options
 *   2. 'reacting'     → show GIF + system reaction text (2.5s)
 *   3. auto-advance   → fade out, next question
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPhase, getReaction } from '../data/reactions';
import { fetchReactionGif } from '../utils/gifFetcher';
import { playBlip, markInteraction } from '../utils/sound';
import './QuestionScreen.css';

export default function QuizScreen({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('asking'); // 'asking' | 'reacting'
  const [selectedOption, setSelectedOption] = useState(null);
  const [reactionText, setReactionText] = useState('');
  const [gifUrl, setGifUrl] = useState(null);
  const [gifLoading, setGifLoading] = useState(false);

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPct = Math.round((currentIndex / totalQuestions) * 100);
  const filled = Math.floor((currentIndex / totalQuestions) * 20);
  const empty = 20 - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

  /**
   * Advance to the next question or complete the quiz.
   */
  const advance = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase('asking');
      setSelectedOption(null);
      setReactionText('');
      setGifUrl(null);
      setGifLoading(false);
    } else {
      // Quiz complete — pass all answers to parent
      onComplete(answers);
    }
  }, [currentIndex, totalQuestions, answers, onComplete]);

  /**
   * Auto-advance after showing reaction for 2.5s (or 1s if GIF failed).
   */
  useEffect(() => {
    if (phase !== 'reacting') return;

    const delay = gifUrl ? 2500 : 1200;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [phase, gifUrl, advance]);

  /**
   * Handle option selection.
   */
  const handleSelect = async (optionIndex) => {
    markInteraction();
    playBlip();

    const option = question.options[optionIndex];
    const newAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(newAnswers);
    setSelectedOption(optionIndex);

    // Get reaction based on phase + answer tier
    const quizPhase = getPhase(currentIndex, totalQuestions);
    const reaction = getReaction(quizPhase, option.tier);
    setReactionText(reaction.text);

    // Switch to reaction mode
    setPhase('reacting');
    setGifLoading(true);

    // Fetch GIF in background
    const url = await fetchReactionGif(reaction.gif);
    setGifUrl(url);
    setGifLoading(false);
  };

  return (
    <motion.div
      className="quiz-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="quiz-screen__container">
        {/* Header */}
        <div className="quiz-screen__header">
          <div className="quiz-screen__header-left">
            <span className="quiz-screen__badge">STRESS PROBE</span>
            <span className="quiz-screen__counter">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
            </span>
          </div>
          <div className="quiz-screen__progress-area">
            <span className="quiz-screen__progress-bar-text">{progressBar}</span>
            <span className="quiz-screen__progress-pct">{progressPct}%</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="quiz-screen__card"
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* System check label */}
            <div className="quiz-screen__label">
              <span className="quiz-screen__label-icon">◈</span>
              SYSTEM CHECK: {question.label}
            </div>

            {/* Question text */}
            <h2 className="quiz-screen__question">{question.question}</h2>

            {/* Options */}
            <div className="quiz-screen__options">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  id={`option-${question.id}-${i}`}
                  className={`quiz-screen__option ${
                    selectedOption === i ? 'quiz-screen__option--selected' : ''
                  }`}
                  onClick={() => handleSelect(i)}
                  whileHover={phase === 'asking' ? { scale: 1.02, x: 4 } : {}}
                  whileTap={phase === 'asking' ? { scale: 0.98 } : {}}
                  disabled={phase !== 'asking'}
                >
                  <span className="quiz-screen__option-radio">
                    {selectedOption === i ? '◉' : '○'}
                  </span>
                  <span className="quiz-screen__option-text">{option.text}</span>
                </motion.button>
              ))}
            </div>

            {/* Reaction area */}
            <AnimatePresence>
              {phase === 'reacting' && (
                <motion.div
                  className="quiz-screen__reaction"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* GIF */}
                  {gifLoading && (
                    <div className="quiz-screen__gif-loading">
                      <span className="quiz-screen__gif-loading-icon">◈</span>
                      FETCHING REACTION DATA...
                    </div>
                  )}
                  {gifUrl && (
                    <div className="quiz-screen__gif-container">
                      <img
                        src={gifUrl}
                        alt="Reaction"
                        className="quiz-screen__gif"
                      />
                    </div>
                  )}

                  {/* System reaction text */}
                  <div className="quiz-screen__reaction-text">
                    <span className="quiz-screen__reaction-prompt">&gt;_</span>
                    {reactionText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Bottom status */}
        <div className="quiz-screen__status">
          <span className="quiz-screen__status-dot" />
          LIVE SCAN IN PROGRESS
        </div>
      </div>
    </motion.div>
  );
}
