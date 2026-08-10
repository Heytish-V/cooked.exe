import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import GridBackground from './components/GridBackground';
import ScanlineOverlay from './components/ScanlineOverlay';
import StartScreen from './screens/StartScreen';
import QuizScreen from './screens/QuestionScreen';
import AnalyzingScreen from './screens/ScanningScreen';
import ResultsScreen from './screens/ResultsScreen';
import questions from './data/questions';
import { selectQuestions } from './engine/questionSelector';
import { calculateResults } from './engine/stressScorer';

/**
 * App — Main state machine for the 4-screen flow.
 *
 * Flow: START → QUIZ → ANALYZING → RESULTS
 *                                      ↓
 *                                   RESTART → START
 */

const SCREENS = {
  START: 'start',
  QUIZ: 'quiz',
  ANALYZING: 'analyzing',
  RESULTS: 'results',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleStart = useCallback(() => {
    // Pick 10 questions from the pool, balanced across categories
    const picked = selectQuestions(questions, 10);
    setSelectedQuestions(picked);
    setAnswers({});
    setResults(null);
    setScreen(SCREENS.QUIZ);
  }, []);

  const handleQuizComplete = useCallback((userAnswers) => {
    setAnswers(userAnswers);
    setScreen(SCREENS.ANALYZING);
  }, []);

  const handleAnalyzingComplete = useCallback(() => {
    // Compute scores with the selected questions and answers
    const computed = calculateResults(selectedQuestions, answers);
    setResults(computed);
    setScreen(SCREENS.RESULTS);
  }, [selectedQuestions, answers]);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setResults(null);
    setSelectedQuestions([]);
    setScreen(SCREENS.START);
  }, []);

  return (
    <div className="app">
      {/* Persistent ambient background effects */}
      <GridBackground />
      <ScanlineOverlay />

      {/* Screen transitions */}
      <AnimatePresence mode="wait">
        {screen === SCREENS.START && (
          <StartScreen key="start" onStart={handleStart} />
        )}
        {screen === SCREENS.QUIZ && (
          <QuizScreen
            key="quiz"
            questions={selectedQuestions}
            onComplete={handleQuizComplete}
          />
        )}
        {screen === SCREENS.ANALYZING && (
          <AnalyzingScreen key="analyzing" onComplete={handleAnalyzingComplete} />
        )}
        {screen === SCREENS.RESULTS && results && (
          <ResultsScreen key="results" results={results} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
