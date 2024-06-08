import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useRooms } from '~/hooks/use-rooms';
import { OnlineCount } from './online-count';

const LeftArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6 stroke-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
);

export const ChatListNav = () => {
  const { roomId } = useParams();
  const { data: rooms } = useRooms();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const room = rooms?.find((room) => room.id === roomId);

  if (isHome || !room) return null;

  return (
    <div className="md:hidden absolute inset-0 z-50 bg-neutral flex h-16 w-full items-center justify-between pr-2">
      <div className="flex gap-2 items-center">
        <NavLink to="/" className="btn btn-square btn-ghost">
          <LeftArrowIcon />
        </NavLink>
        <span className="font-bold">{room.name}</span>
      </div>

      <OnlineCount />
    </div>
  );
};
