import { useEffect, useState } from 'react';

export const useCountdown = (initialCount: number) => {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (countdown < 0) return;

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  return countdown;
};
