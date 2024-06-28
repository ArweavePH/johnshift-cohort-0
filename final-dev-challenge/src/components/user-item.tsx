import { User } from '~/core/types';
import { formatAddress } from '~/utils/format-address';

import { UserAvatar } from './user-avatar';

interface Props {
  user: User;
  isHost?: boolean;
}

export const UserItem = ({ user: { wallet, name }, isHost }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <UserAvatar wallet={wallet} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-xl font-bold">{name}</span>
          {isHost && <div className="badge badge-secondary badge-sm">HOST</div>}
        </div>
        <span className="self-start truncate text-sm font-bold text-secondary/80">
          {formatAddress(wallet, 4)}
        </span>
      </div>
    </div>
  );
};
