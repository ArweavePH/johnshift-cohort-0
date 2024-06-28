import { useEffect, useRef, useState } from 'react';

export const useTimer = (
  initialTime: number,
  isActive: boolean,
  callback: () => void,
) => {
  const ref = useRef(Date.now());
  const [timeLeft, setTimeLeft] = useState(initialTime * 1000);

  useEffect(() => {
    if (!isActive || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 10);
    }, 10);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      callback();
    }
  }, [timeLeft, callback]);

  return { timeLeft, timeStarted: ref.current };
};
