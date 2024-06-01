'use client';

import { Toaster } from 'react-hot-toast';

import { Nav } from '@/components/nav';
import { PollFeed } from '@/components/poll-feed';

export default function Home() {
  return (
    <>
      <Nav />
      <div className="flex justify-center gap-4 pt-24">
        <main className="flex min-h-screen w-full max-w-2xl flex-col">
          <PollFeed />
        </main>
      </div>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: '#1d232a',
              color: 'white',
            },
          },
        }}
      />
    </>
  );
}
