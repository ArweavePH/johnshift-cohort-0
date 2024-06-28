import { ClassValue } from 'clsx';

import { cn } from '~/utils/cn';
import { useTimer } from '~/hooks/use-timer';

interface Props {
  timeLimit: number;
  isCounting: boolean;
  callback: () => void;
  className?: ClassValue;
}

export const Timer = ({
  timeLimit,
  isCounting,
  callback,
  className,
}: Props) => {
  const { timeLeft } = useTimer(timeLimit, !isCounting, callback);

  return (
    <progress
      className={cn(
        'progress progress-secondary h-3 w-full rounded-md',
        className,
        {
          'progress-accent': timeLeft < 7000,
          'progress-warning': timeLeft < 5000,
          'progress-error': timeLeft < 3500,
        },
      )}
      value={timeLeft}
      max={timeLimit * 1000}
    />
  );
};
