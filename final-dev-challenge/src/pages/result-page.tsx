import { useEffect, useState } from 'react';

import { MODAL_IDS } from '~/core/constants';
import { Game } from '~/core/types';
import { GamePageWrapper } from '~/components/game-page-wrapper';
import { GameStats } from '~/components/game-stats';
import { Nav } from '~/components/nav';
import { NextQuestionButton } from '~/components/next-question-button';
import { PlayerScores } from '~/components/player-scores';
import { ResultChoices } from '~/components/result-choices';

interface Props {
  game: Game;
  isHost: boolean;
}

export const ResultPage = ({ game, isHost }: Props) => {
  const text = game.currentQuestionIndex === 10 ? 'End Game' : 'Next Question';
  const pageAction = isHost ? (
    <NextQuestionButton gameId={game.id} text={text} />
  ) : null;

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && game.category === 'Guess the animal') {
      setInitialized(true);

      const dialogElement = document.getElementById(
        MODAL_IDS.SHOW_ANSWER,
      ) as HTMLDialogElement | null;

      if (dialogElement) {
        dialogElement.showModal();
      }
    }
  }, [game.category, initialized]);

  return (
    <>
      <Nav pageAction={pageAction} />
      <GamePageWrapper>
        <div className="flex w-full flex-col gap-8 pb-60">
          <div className="flex flex-col lg:flex-row">
            {/* <pre>{JSON.stringify(game.answers, undefined, '\t')}</pre> */}
            <ResultChoices game={game} />
            <div className="flex w-full flex-col gap-8 pt-2">
              <GameStats game={game} />
              <PlayerScores game={game} />
            </div>
          </div>
        </div>
      </GamePageWrapper>

      <dialog id={MODAL_IDS.SHOW_ANSWER} className="modal">
        <div className="modal-box w-full max-w-3xl space-y-8">
          <h1 className="self-start text-4xl font-bold">
            {game.currentAnswer}
          </h1>
          <div className="flex w-full justify-center">
            <img
              src={game.currentQuestion!.image.answer}
              alt={game.currentQuestion!.question}
              height={500}
              width={500}
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
