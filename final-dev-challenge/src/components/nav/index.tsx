import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { NavDialog } from './dialog';

const BarsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className="size-8 text-neutral-content"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="M5 7h14M5 12h14M5 17h14"
    ></path>
  </svg>
);

interface Props {
  content?: React.ReactNode;
  pageAction?: React.ReactNode;
}

export const Nav = ({ content, pageAction = null }: Props) => {
  const { gameId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed top-0 z-50 flex w-full justify-center">
      <div className="flex w-full pt-0 lg:max-w-7xl lg:pt-4">
        <NavDialog sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="sticky top-0 z-40 w-full">
          <div className="flex h-20 items-center gap-x-4 bg-neutral px-4 py-8 shadow-sm sm:gap-x-6 lg:rounded-2xl lg:shadow-none">
            <div className="flex grow items-center gap-4">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <BarsIcon />
              </button>
              {content
                ? content
                : gameId && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xl">Game ID: </span>
                      <span className="text-2xl font-bold text-secondary">
                        {gameId}
                      </span>
                    </div>
                  )}
            </div>

            <div className="w-fit">{pageAction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
