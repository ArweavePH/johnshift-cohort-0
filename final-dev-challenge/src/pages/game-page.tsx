import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAddPlayer } from '~/hooks/use-add-player';
import { useAddress } from '~/hooks/use-address';
import { useGame } from '~/hooks/use-game';
import { useUser } from '~/hooks/use-user';

import { ErrorPage } from './error-page';
import { HostQuestionPage } from './host-question-page';
import { LoadingPage } from './loading-page';
import { LobbyPage } from './lobby-page';
import { PlayerQuestionPage } from './player-question-page';
import { ResultPage } from './result-page';

export const GamePage = () => {
  const { gameId } = useParams();
  const { address: wallet, isReady } = useAddress();
  const { data: gameData } = useGame(gameId);
  const { data: userData } = useUser(wallet);

  const isHost = !!gameData && !!gameData.data && gameData.data.host === wallet;
  const { mutate, isPending } = useAddPlayer();

  useEffect(() => {
    if (!isReady) return;
    if (!wallet) return;
    if (isHost) return;
    if (isPending) return;
    if (!gameData) return;
    if (!gameData.data) return;
    if (gameData.data.timeEnded) return;
    if (gameData.data.players.some((player) => player.wallet === wallet))
      return;

    mutate({ gameId: gameId!, wallet });
  }, [gameId, gameData, isReady, isPending, wallet, mutate, isHost]);

  if (!gameId) return <LoadingPage />;
  if (!wallet) return <LoadingPage />;
  if (!isReady) return <LoadingPage />;
  if (!gameData) return <LoadingPage />;
  if (!userData) return <LoadingPage />;

  if (!gameData.success) {
    return (
      <ErrorPage message={gameData.message} notFoundMessage="Game not found" />
    );
  }

  const { data: game } = gameData;

  if (game.state === 'lobby') {
    return <LobbyPage isHost={isHost} game={game} />;
  }

  if (game.state === 'playing' && game.currentQuestion) {
    return isHost ? (
      <HostQuestionPage
        gameId={gameId}
        question={game.currentQuestion}
        timeLimit={game.timeLimit}
        category={game.category}
      />
    ) : (
      <PlayerQuestionPage
        gameId={gameId}
        wallet={wallet}
        question={game.currentQuestion}
        timeLimit={game.timeLimit}
      />
    );
  }

  if (game.state === 'result') {
    return <ResultPage game={game} isHost={isHost} />;
  }

  return <ErrorPage message="Game page invalid state" />;
};
