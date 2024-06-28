import { useNavigate } from 'react-router-dom';

import { cn } from '~/utils/cn';
import { useAddress } from '~/hooks/use-address';
import { useConnection } from '~/hooks/use-connection';
import { useGameList } from '~/hooks/use-game-list';
import { useUser } from '~/hooks/use-user';

import { PowerIcon } from '../icons';
import { UserItem } from '../user-item';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { data } = useGameList();

  return (
    <div className="flex grow flex-col space-y-6 overflow-y-auto bg-neutral p-4">
      <div className="flex h-20 shrink-0 items-center justify-between">
        <button className="btn btn-ghost">
          <span className="text-4xl font-bold text-accent">KADYUT!</span>
        </button>
      </div>

      <UserSection />

      <nav className="flex flex-1 flex-col pl-4">
        <ul role="list" className="flex flex-1 flex-col">
          <li className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-4 py-4">
              <div className="font-semibold leading-6 text-gray-400">
                Game List
              </div>
              {!data && <span className="loading loading-spinner loading-xs" />}
            </div>
            {data && (
              <ul role="list" className="mx-2 mt-2 space-y-4">
                {data.map(({ gameId, state, timeStarted, timeEnded }) => {
                  const stateText =
                    state === 'playing'
                      ? 'Playing'
                      : timeEnded
                      ? 'Ended'
                      : state === 'lobby' && !timeStarted
                      ? 'Waiting'
                      : 'Checking';

                  const badgeClass =
                    stateText === 'Waiting'
                      ? 'badge-secondary'
                      : stateText === 'Ended'
                      ? 'badge-primary'
                      : 'badge-accent';

                  return (
                    <button
                      key={gameId}
                      className="btn btn-ghost flex w-full gap-4 bg-neutral-content/5"
                      onClick={() => navigate(`/games/${gameId}`)}
                    >
                      <span className="text-lg font-bold">{gameId}</span>
                      <div
                        className={cn('badge badge-sm rounded-sm', badgeClass)}
                      >
                        {stateText}
                      </div>
                    </button>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

const UserSection = () => {
  const { disconnect, isPending } = useConnection();
  const { address: wallet, isReady } = useAddress();
  const { data: userData } = useUser(wallet);

  const isLoading = !isReady || !userData || isPending;

  if (!userData) return null;

  return (
    <div className="mt-auto p-4">
      <div className="flex items-center justify-between">
        <UserItem user={userData.data} />
        <button
          disabled={isLoading}
          className="btn btn-square btn-ghost rounded-lg"
          onClick={disconnect}
        >
          {isLoading ? (
            <span className="loading loading-spinner text-white/20" />
          ) : (
            <PowerIcon />
          )}
        </button>
      </div>
    </div>
  );
};
