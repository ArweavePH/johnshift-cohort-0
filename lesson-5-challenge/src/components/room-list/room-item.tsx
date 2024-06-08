import { NavLink, useLocation, useParams } from 'react-router-dom';

import { cn } from '~/utils/cn';
import { OnlineCount } from '~/components/online-count';
import { useUpdateOnlineStatus } from '~/hooks/use-update-online-status';
import { useUserAddress } from '~/hooks/use-user-address';
import { recentRoomIdAtom } from '~/core/atoms';
import { useAtomValue } from 'jotai';

interface Props {
  id: string;
  name: string;
}

export const ChatroomItem = ({ id, name }: Props) => {
  const { roomId } = useParams();
  const { pathname } = useLocation();
  const isActive = pathname === `/${id}`;

  // If room is active route to home, else route to room
  const to = `/${id === roomId ? '' : id}`;
  const matched = pathname === `/${id}`;

  const { data: address } = useUserAddress();
  const { mutate } = useUpdateOnlineStatus();

  const recentRoomId = useAtomValue(recentRoomIdAtom);
  const onClick = () => {
    if (recentRoomId === null && id) {
      mutate({ id, user: address ?? 'ANON', shouldAdd: true });
    }

    if (recentRoomId === id) {
      mutate({ id, user: address ?? 'ANON', shouldAdd: false });
    }

    if (recentRoomId && recentRoomId !== id) {
      mutate({ id: recentRoomId, user: address ?? 'ANON', shouldAdd: false });
      mutate({ id, user: address ?? 'ANON', shouldAdd: true });
    }
  };

  return (
    <NavLink
      to={to}
      className={cn('btn btn-ghost w-full rounded-none h-20 hover:bg-neutral', {
        'bg-neutral/60': isActive,
      })}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <span className="text-lg">{`${name}`}</span>
        {matched && <OnlineCount />}
      </div>
    </NavLink>
  );
};
