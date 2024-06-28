import { User } from '~/core/types';

import { UserItem } from './user-item';

interface Props {
  host: string;
  players: User[];
}

export const PlayerList = ({ host, players }: Props) => {
  const showPlayers = players.length > 0;
  if (!showPlayers) return null;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Players:</h2>
      <div className="flex w-full flex-wrap gap-4">
        {players.map((user) => (
          <button
            key={user.wallet}
            className="btn btn-neutral flex h-20 w-full items-center justify-center sm:w-56"
          >
            <UserItem isHost={host === user.wallet} user={user} />
          </button>
        ))}
      </div>
    </div>
  );
};
