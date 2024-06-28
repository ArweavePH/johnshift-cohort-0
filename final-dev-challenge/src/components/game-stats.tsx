import { Game } from '~/core/types';

import { Stat } from './stat';

interface Props {
  game: Game;
}

export const GameStats = ({ game }: Props) => {
  const question = game.currentQuestion!;
  const filteredAnswers = game.answers!.filter(
    (answer) => answer.questionId === question.id && answer.score > 0,
  );

  const totalParticipants = game.players.length;
  const avg =
    totalParticipants > 0
      ? filteredAnswers.reduce((sum, { score }) => sum + score, 0) /
        totalParticipants
      : 0;

  const wrongAnswers = filteredAnswers.filter(
    (answer) => answer.selected !== game.currentAnswer,
  ).length;

  const stats = [
    { title: 'Player Count', value: totalParticipants },
    { title: 'Average Score', value: avg },
    { title: 'Wrong Answers', value: wrongAnswers },
  ];

  return (
    <div className="flex w-full max-w-2xl justify-between gap-4">
      {stats.map(({ title, value }) => (
        <Stat key={title} title={title} value={`${value}`} />
      ))}
    </div>
  );
};
