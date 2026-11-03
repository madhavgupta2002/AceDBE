/** Elapsed-seconds stopwatch for a quiz session; ticks once a second while active. */
import { useState, useEffect } from 'react';

export function useQuizTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (!isTimerActive) return;
    const interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerActive]);

  return { elapsedSeconds, setElapsedSeconds, isTimerActive, setIsTimerActive };
}
