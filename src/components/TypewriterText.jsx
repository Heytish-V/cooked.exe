import { useState, useEffect } from 'react';

/**
 * TypewriterText — Character-by-character text reveal with cursor blink.
 *
 * @param {string} text — the text to reveal
 * @param {number} speed — ms per character (default 40)
 * @param {string} className — optional extra CSS class
 * @param {function} onComplete — callback when typing finishes
 */
export default function TypewriterText({ text, speed = 40, className = '', onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`typewriter ${className}`}>
      {displayed}
      <span className={`typewriter__cursor ${done ? 'typewriter__cursor--blink' : ''}`}>█</span>
    </span>
  );
}
