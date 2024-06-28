import { useNavigate } from 'react-router-dom';

import { Game } from '~/core/types';
import { useUser } from '~/hooks/use-user';
import { GamePageWrapper } from '~/components/game-page-wrapper';
import { Nav } from '~/components/nav';
import { NextQuestionButton } from '~/components/next-question-button';
import { PlayerList } from '~/components/player-list';
import { PlayerScores } from '~/components/player-scores';
import { Stat } from '~/components/stat';
import { UserItem } from '~/components/user-item';

import { ErrorPage } from './error-page';
import { LoadingPage } from './loading-page';

interface Props {
  isHost: boolean;
  game: Game;
}

export const LobbyPage = ({ isHost, game }: Props) => {
  const navigate = useNavigate();
  const { data: userData } = useUser(game.host);

  if (!userData) return <LoadingPage />;
  if (!userData.success) return <ErrorPage message={userData.message} />;

  const hasEnded = !!game.timeEnded;
  const { data: user } = userData;

  const pageAction = hasEnded ? (
    <button className="btn btn-accent" onClick={() => navigate('/')}>
      Exit Game
    </button>
  ) : isHost ? (
    <NextQuestionButton gameId={game.id} text="START GAME" />
  ) : null;

  const stats = [
    { title: 'Category', value: game.category },
    { title: 'Time Limit', value: `${game.timeLimit}` },
    { title: 'Status', value: game.timeEnded ? 'Ended' : 'Waiting' },
  ];

  return (
    <>
      <Nav pageAction={pageAction} />
      <GamePageWrapper>
        <div className="flex w-full flex-col space-y-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Game Info:</h2>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <button
                key={user.wallet}
                className="btn btn-neutral flex h-24 items-center justify-center sm:w-72"
              >
                <UserItem isHost user={user} />
              </button>
              {stats.map((stat) => (
                <Stat
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  className="flex grow justify-center bg-neutral p-4"
                />
              ))}
            </div>
          </div>

          <PlayerList host={game.host} players={game.players} />

          {!!game.timeEnded && <PlayerScores game={game} />}
        </div>
      </GamePageWrapper>
    </>
  );
};
