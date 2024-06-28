/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart } from '@tremor/react';

import { MODAL_IDS } from '~/core/constants';
import { Answer, Game, Question, User } from '~/core/types';

import { UserAvatar } from './user-avatar';

const getChoiceCountsX = (question: Question, answers: Answer[]) => {
  const playerSelections: Record<string, User[]> = {
    [question.choices[0]]: [],
    [question.choices[1]]: [],
    [question.choices[2]]: [],
    [question.choices[3]]: [],
  };

  const filteredAnswers = answers.filter(
    (answer) => answer.questionId === question.id,
  );

  for (const answer of filteredAnswers) {
    if (answer.selected) {
      playerSelections[answer.selected].push(answer.user);
    }
  }

  return Object.entries(playerSelections).map(([choice, users]) => ({
    choice,
    users,
    count: users.length,
  }));
};

interface Props {
  game: Game;
}

export const ResultChoices = ({ game }: Props) => {
  // TODO: see custom tooltip in ui, see if it can display who answered which

  const choiceCounts = getChoiceCountsX(game.currentQuestion!, game.answers!);
  if (!game.currentQuestion) return null;

  const isAnimal = game.category === 'Guess the animal';

  const onClickAnswer = () => {
    if (isAnimal) {
      const dialogElement = document.getElementById(
        MODAL_IDS.SHOW_ANSWER,
      ) as HTMLDialogElement | null;

      if (dialogElement) {
        dialogElement.showModal();
      }
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8 p-4">
      {!isAnimal && (
        <div className="space-y-2">
          <h1 className="text-xl font-bold md:text-2xl">
            {game.currentQuestion.question}
          </h1>
        </div>
      )}

      <BarChart
        className="shrink-0"
        showAnimation
        showLegend={false}
        data={choiceCounts}
        index="choice"
        categories={['count']}
        customTooltip={CustomTooltip}
        yAxisWidth={20}
      />
      <h1 className="text-xl font-bold  md:text-2xl">
        <span className="">Correct Answer:</span>
        <span
          className="btn-link cursor-pointer pl-4 text-secondary underline"
          onClick={onClickAnswer}
        >
          {game.currentAnswer}
        </span>
      </h1>
    </div>
  );
};

interface CustomTooltipProps {
  payload: any;
  active: boolean | undefined;
  label: any;
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { payload, active } = props;
  if (!active || !payload) return null;

  const { users, count } = payload[0].payload;

  const hasUsers = count > 0;

  if (!hasUsers) return null;

  return (
    <div className="min-h-[40px] rounded-tremor-default border border-neutral bg-neutral p-4 text-tremor-default shadow-tremor-dropdown">
      <div className="flex flex-col gap-2.5">
        {users.map((user: User) => (
          <div key={user.wallet} className="flex items-center gap-2">
            <UserAvatar wallet={user.wallet} className="w-4" />
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
