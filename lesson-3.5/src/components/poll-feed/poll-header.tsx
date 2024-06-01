/* eslint-disable @next/next/no-img-element */
import { cn } from '@/utils/cn';
import { formatAddress } from '@/utils/format-address';
import { prettyTimestamp } from '@/utils/pretty-timestamp';

interface Props {
  address: string;
  timestamp: number;
  isPendingUpload: boolean;
}

export const PollHeader = ({ address, timestamp, isPendingUpload }: Props) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-12 rounded-full ring ring-slate-600 ring-offset-2 ring-offset-base-100">
            <img
              alt={address}
              src={`https://api.dicebear.com/8.x/bottts/svg?seed=${address}`}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold">{formatAddress(address)}</span>
          <span className="text-sm text-white/60">
            {prettyTimestamp(timestamp)}
          </span>
        </div>
      </div>
      <div
        className="tooltip"
        data-tip={isPendingUpload ? 'Uploading' : 'Permanent'}
      >
        <div className="indicator">
          <span
            className={cn(
              'badge indicator-item badge-success badge-xs indicator-top',
              {
                'badge-warning': isPendingUpload,
              },
            )}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
