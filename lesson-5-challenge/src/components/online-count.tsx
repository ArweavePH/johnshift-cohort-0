import { useParams } from 'react-router-dom';
import { useRooms } from '~/hooks/use-rooms';
import { cn } from '~/utils/cn';

export const OnlineCount = () => {
  const { roomId } = useParams();
  const { data: rooms } = useRooms();
  const room = rooms?.find((room) => room.id === roomId);

  if (!room) return null;

  const onlineCount = room.online.length;

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn('badge badge-primary badge-xs', {
          'badge-warning': onlineCount === 0,
        })}
      />
      <span className="text-sm text-neutral-content/70">{`${onlineCount} Online`}</span>
    </div>
  );
};
