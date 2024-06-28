import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { CHOICES_SHAPE, ChoicesKey } from '~/core/misc';
import { Question } from '~/core/types';
import { cn } from '~/utils/cn';
import { useCountdown } from '~/hooks/use-countdown';
import { useSubmitAnswer } from '~/hooks/use-submit-answer';
import { Timer } from '~/components/timer';

import { CountdownPage } from './countdown-page';
import { LoadingPage } from './loading-page';

interface Props {
  gameId: string;
  wallet: string;
  question: Question;
  timeLimit: number;
}

const COUNTDOWN_OFFSET = 3000;

export const PlayerQuestionPage = (props: Props) => {
  const {
    gameId,
    wallet,
    question: { id, choices },
    timeLimit,
  } = props;

  const countdown = useCountdown(3);
  const isCounting = countdown > -1;

  const timeStarted = useRef<number | null>(null);
  useEffect(() => {
    if (countdown === 0 && timeStarted.current === null) {
      timeStarted.current = Date.now();
    }
  }, [countdown, isCounting]);

  const [selectedAnswer, setSelectedAnswer] = useState('');

  const { mutate, isPending } = useSubmitAnswer();

  const [timesUp, setTimesUp] = useState(false);
  const [score, setScore] = useState<null | number>(null);

  const toastCallback = () => {
    setTimeout(() => {
      if (score !== null) {
        if (score > 0)
          toast.success(`CORRECT! You earned +${score} points!`, {
            duration: 10000,
          });
        if (score === 0)
          toast.error('INCORRECT! 😝', {
            duration: 4000,
          });
      }
    }, 2000);
    setTimesUp(true);
  };

  const submit = (choice: string) => {
    setSelectedAnswer(choice);

    if (!isPending) {
      const elapsedTime = Date.now() - timeStarted.current! - COUNTDOWN_OFFSET;
      mutate(
        { gameId, wallet, questionId: id, selectedAnswer: choice, elapsedTime },
        {
          onSuccess: (data) => {
            setScore(data);
          },
        },
      );
    }
  };

  if (isCounting) return <CountdownPage countdown={countdown} />;
  if (timesUp) return <LoadingPage message="Loading Result" />;

  return (
    <div className="h-screen space-y-4 p-4 pb-16">
      <Timer
        timeLimit={timeLimit}
        isCounting={isCounting}
        // callback={submit}
        callback={toastCallback}
        className="h-4"
      />
      <div className="grid h-full grid-cols-2 gap-4">
        {choices.map((choice, i) => {
          const isSelected = choice === selectedAnswer;
          return (
            <button
              key={choice}
              className={cn(
                'btn btn-lg h-full text-xl hover:bg-purple-500 md:min-h-[300px] md:text-4xl',
                {
                  'bg-red-600': i === 0,
                  'bg-blue-600': i === 1,
                  'bg-yellow-500': i === 2,
                  'bg-green-600': i === 3,
                  'pointer-events-none': !!selectedAnswer,
                  'opacity-30 bg-transparent': !!selectedAnswer && !isSelected,
                },
              )}
              onClick={() => submit(choice)}
            >
              {CHOICES_SHAPE[i as ChoicesKey]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
