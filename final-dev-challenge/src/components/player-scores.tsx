import { useReducer } from 'react';

import { BarList } from '@tremor/react';

import { Answer, Game, Question } from '~/core/types';

import { UserAvatar } from './user-avatar';

const getPlayerScores = (
  question: Question,
  answers: Answer[],
  hasEnded: boolean,
) => {
  const data = hasEnded
    ? answers
    : answers.filter((answer) => answer.questionId === question.id);

  const playerScores = data.reduce<
    Record<string, { name: string; wallet: string; score: number }>
  >((acc, { user: { name, wallet }, score }) => {
    const key = `${name}-${wallet}`;
    if (!acc[key]) {
      acc[key] = { name, wallet, score: 0 };
    }
    acc[key].score += score;
    return acc;
  }, {});

  return Object.values(playerScores)
    .sort((a, b) => b.score - a.score)
    .map(({ name, wallet, score }) => ({
      name: (
        <div className="flex h-full items-center gap-2">
          <UserAvatar wallet={wallet} className="w-4" />
          <span className="text-sm font-bold">{name}</span>
        </div>
      ),
      value: score,
    }));
};

interface Props {
  game: Game;
}

export const PlayerScores = ({ game }: Props) => {
  const [showAll, toggleShowMore] = useReducer((prev) => !prev, false);

  const hasEnded = !!game.timeEnded;
  const result = getPlayerScores(
    game.currentQuestion!,
    game.answers!,
    // xData,
    hasEnded,
  );

  if (result.length === 0) {
    return null;
  }

  const data = showAll ? result : result.slice(0, 5);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
          {showAll ? 'Player Scores' : 'Top 5'}
        </h1>
        {result.length > 5 && (
          <button
            className="btn btn-ghost text-white/60"
            onClick={toggleShowMore}
          >{`Show ${showAll ? 'Less' : 'All'}`}</button>
        )}
      </div>
      <BarList showAnimation data={data} />
    </div>
  );
};
