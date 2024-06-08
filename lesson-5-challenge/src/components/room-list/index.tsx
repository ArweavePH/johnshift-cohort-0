/* eslint-disable tailwindcss/no-custom-classname */
import { useLocation } from 'react-router-dom';
import { UserSection } from '../user-section';

import { ChatroomForm } from './room-form';
import { ChatroomItem } from './room-item';

import { useRooms } from '~/hooks/use-rooms';
import { cn } from '~/utils/cn';

export const ChatroomList = () => {
  const { pathname } = useLocation();
  const { data: rooms } = useRooms();

  const isHome = pathname === '/';

  return (
    <div
      className={cn(
        'absolute inset-0 flex min-h-screen w-full md:max-w-xs flex-col border-r border-neutral-content/10',
        { 'hidden md:flex': !isHome },
      )}
    >
      <UserSection />

      <div className="hide-scrollbar max-h-[calc(100vh-128px)] grow overflow-y-scroll">
        {rooms ? (
          <>
            {rooms.map(({ id, name }) => (
              <ChatroomItem key={id} id={id} name={name} />
            ))}
          </>
        ) : null}
      </div>

      <div className="flex h-16 items-center justify-center border-t border-neutral-content/10">
        <ChatroomForm />
      </div>
    </div>
  );
};
