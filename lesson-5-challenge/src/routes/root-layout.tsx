import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useParams } from 'react-router-dom';
import { recentRoomIdAtom } from '~/core/atoms';
import { useSetAtom } from 'jotai';

import { ChatroomList } from '~/components/room-list';

export const RootLayout = () => {
  const { roomId } = useParams();
  const setRecentRoomId = useSetAtom(recentRoomIdAtom);

  useEffect(() => {
    setRecentRoomId(roomId ?? null);
  }, [roomId]);

  return (
    <div className="flex justify-center bg-base-300">
      <div className="flex w-full justify-center container bg-base-100 relative px-2">
        <ChatroomList />
        <div className="hidden md:block min-h-screen w-full md:max-w-xs" />
        <main className="w-full">
          <Outlet />
        </main>
      </div>

      <Toaster
        toastOptions={{
          style: {
            background: '#1E293B',
            color: 'white',
          },
        }}
      />
    </div>
  );
};
