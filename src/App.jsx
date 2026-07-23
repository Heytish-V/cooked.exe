import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import GridBackground from './components/GridBackground';
import ScanlineOverlay from './components/ScanlineOverlay';
import BootScreen from './screens/BootScreen';
import QuestionScreen from './screens/QuestionScreen';
import ScanningScreen from './screens/ScanningScreen';
import ResultsScreen from './screens/ResultsScreen';

/**
 * App — Main state machine for the 4-screen flow.
 *
 * Screen flow: boot → questions → scanning → results
 * State is managed with a simple string + answers object.
 */

const SCREENS = {
  BOOT: 'boot',
  QUESTIONS: 'questions',
  SCANNING: 'scanning',
  RESULTS: 'results',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.BOOT);
  const [answers, setAnswers] = useState({});

  const handleBootComplete = useCallback(() => {
    setScreen(SCREENS.QUESTIONS);
  }, []);

  const handleQuestionsComplete = useCallback((userAnswers) => {
    setAnswers(userAnswers);
    setScreen(SCREENS.SCANNING);
  }, []);

  const handleScanComplete = useCallback(() => {
    setScreen(SCREENS.RESULTS);
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setScreen(SCREENS.BOOT);
  }, []);

  return (
    <div className="app">
      {/* Persistent background effects */}
      <GridBackground />
      <ParticleBackground />
      <ScanlineOverlay />

      {/* Screen transitions */}
      <AnimatePresence mode="wait">
        {screen === SCREENS.BOOT && (
          <BootScreen key="boot" onComplete={handleBootComplete} />
        )}
        {screen === SCREENS.QUESTIONS && (
          <QuestionScreen key="questions" onComplete={handleQuestionsComplete} />
        )}
        {screen === SCREENS.SCANNING && (
          <ScanningScreen key="scanning" onComplete={handleScanComplete} />
        )}
        {screen === SCREENS.RESULTS && (
          <ResultsScreen key="results" answers={answers} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
