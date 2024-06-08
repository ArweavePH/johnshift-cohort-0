import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router-dom';

import { ChatItem } from './chat-item';

import { useChatList } from '~/hooks/use-chat-list';
import { useRooms } from '~/hooks/use-rooms';
import { useUserAddress } from '~/hooks/use-user-address';
import { prettyTimestamp } from '~/utils/pretty-timestamp';

export const ChatList = () => {
  const { roomId } = useParams();
  const { data: rooms } = useRooms();
  const { data: address } = useUserAddress();
  const { data, error, fetchNextPage, hasNextPage } = useChatList(roomId);

  const isLoading = !data || !rooms;
  const chats = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  const initBottomScrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = 'instant') => {
    if (initBottomScrollRef.current) {
      initBottomScrollRef.current.scrollIntoView({ behavior });
    }
    setHasScrolled(true);
  };

  // Scroll to bottom first
  useEffect(() => {
    if (!hasScrolled && chats.length > 0) {
      const timeoutId = setTimeout(scrollToBottom, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [hasScrolled, chats.length]);

  // Reset hasScrolled when roomId changes
  useEffect(() => {
    setHasScrolled(false);
  }, [roomId]);

  const afterScrollRef = useRef<HTMLDivElement>(null);

  // Next page fetch on scroll
  const { ref: inViewRef } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && !error && hasScrolled) {
        fetchNextPage().then(() => {
          if (afterScrollRef.current) {
            afterScrollRef.current.scrollIntoView({
              behavior: 'smooth',
            });
          }
        });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex size-full max-w-2xl grow items-center justify-center pt-4">
        <span className="loading loading-ring loading-lg" />
      </div>
    );
  }

  return (
    <>
      <div className="pt-20 md:pt-8 flex w-full max-w-2xl grow flex-col justify-end gap-8">
        {hasNextPage ? (
          <div ref={inViewRef} className="flex w-full justify-center">
            <span className="loading loading-ring loading-lg" />
          </div>
        ) : (
          <div className="divider">
            <span className="text-base text-base-content/60">
              <div className="flex flex-col items-center">
                <span className="font-bold">Room Created</span>
                <span className="text-xs text-base-content/40">
                  {prettyTimestamp(
                    rooms.find((room) => room.id === roomId)!.timestamp,
                  )}
                </span>
              </div>
            </span>
          </div>
        )}

        {chats.reverse().map(({ id, owner, message, timestamp, file }, i) => (
          <div key={id} ref={i === 1 ? afterScrollRef : undefined}>
            <ChatItem
              isEnd={owner === address}
              owner={owner}
              timestamp={timestamp}
              message={message}
              file={file}
            />
          </div>
        ))}
        <div ref={initBottomScrollRef} className="h-10" />
      </div>
    </>
  );
};
