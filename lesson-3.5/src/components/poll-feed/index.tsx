'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';

import { usePollFeed } from '@/hooks/use-poll-feed';

import { PollHeader } from './poll-header';
import { PollSelection } from './poll-selection';

export const PollFeed = () => {
  const { data } = usePollFeed();
  const [parent] = useAutoAnimate();

  if (!data)
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white/60" />
      </div>
    );

  return (
    <div ref={parent} className="flex flex-col gap-8 p-4">
      {data.map((poll) => (
        <div
          key={poll.id}
          className="flex w-full flex-col gap-4 rounded-xl border border-neutral p-8"
        >
          <PollHeader
            address={poll.owner}
            timestamp={poll.timestamp}
            isPendingUpload={!poll.txTimestamp}
          />
          <PollSelection poll={poll} />
        </div>
      ))}
    </div>
  );
};
