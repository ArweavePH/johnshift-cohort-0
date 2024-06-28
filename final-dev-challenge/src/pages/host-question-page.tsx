import { CHOICES_SHAPE, ChoicesKey } from '~/core/misc';
import { Category, Question } from '~/core/types';
import { cn } from '~/utils/cn';
import { useCountdown } from '~/hooks/use-countdown';
import { useUpdateGameState } from '~/hooks/use-update-game-state';
import { Timer } from '~/components/timer';

import { CountdownPage } from './countdown-page';
import { LoadingPage } from './loading-page';

interface Props {
  category: Category;
  gameId: string;
  question: Question;
  timeLimit: number;
}

export const HostQuestionPage = ({
  category,
  gameId,
  question,
  timeLimit,
}: Props) => {
  const countdown = useCountdown(3);
  const isCounting = countdown > -1;

  const { mutate, isPending } = useUpdateGameState();

  if (isPending) return <LoadingPage />;
  if (isCounting) return <CountdownPage countdown={countdown} />;

  const submit = () => {
    if (!isPending) {
      mutate({
        gameId,
        state: 'result',
      });
    }
  };

  const isAnimals = category === 'Guess the animal';

  return (
    <div className="flex h-screen w-full justify-center pt-4">
      <div className="flex w-full max-w-6xl flex-col items-center gap-8 p-4 md:p-8">
        {isAnimals ? (
          <div className="grow">
            <img
              src={question.image.question}
              alt={question.question}
              height={500}
              width={500}
            />
          </div>
        ) : (
          <div className="flex items-center pt-4">
            <h1 className="text-2xl font-bold md:text-4xl">
              {question.question}
            </h1>
          </div>
        )}

        <Timer
          timeLimit={timeLimit}
          isCounting={isCounting}
          callback={submit}
        />
        <div className="grid w-full grid-cols-2 gap-4">
          {question.choices.map((choice, i) => {
            return (
              <button
                key={choice}
                className={cn(
                  'btn btn-lg pointer-events-none relative min-h-[180px] text-xl md:min-h-[300px] md:text-4xl',
                  {
                    'bg-red-600': i === 0,
                    'bg-blue-600': i === 1,
                    'bg-yellow-500': i === 2,
                    'bg-green-600': i === 3,
                  },
                  {
                    'min-h-[100px] md:min-h-[180px]': isAnimals,
                  },
                )}
              >
                <div className="absolute left-0 top-0 flex size-full items-center justify-center text-white/15 [&>*]:size-36">
                  {CHOICES_SHAPE[i as ChoicesKey]}
                </div>
                <div className="z-30">{choice}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
