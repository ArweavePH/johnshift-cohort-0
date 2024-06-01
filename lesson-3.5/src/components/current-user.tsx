/* eslint-disable @next/next/no-img-element */
'use client';

import { formatAddress } from '@/utils/format-address';
import { useBalance } from '@/hooks/use-balance';
import { useConnectWallet } from '@/hooks/use-connect-wallet';
import { useDisconnect } from '@/hooks/use-disconnect';
import { useUserAddress } from '@/hooks/use-user-address';

export const CurrentUser = () => {
  const { data: address } = useUserAddress();
  const { data: balance } = useBalance();

  const { mutate: disconnect, isPending: isPendingDisconnect } =
    useDisconnect();
  const onClickDisconnect = () => {
    disconnect();
    console.log('DISCONNECT');
  };

  const { mutate: connectWallet, isPending: isPendingConnect } =
    useConnectWallet();
  const onClickConnect = () => {
    connectWallet();
    console.log('CONNECT');
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-neutral p-4">
        <div data-tip="Connect wallet to start interacting" className="tooltip">
          <button
            className="btn"
            onClick={onClickConnect}
            disabled={isPendingConnect || !!address}
          >
            {isPendingConnect && <span className="loading loading-spinner" />}
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral p-4">
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
          <span className="text-xs text-white/60">
            {balance ? (
              <span className="font-bold text-white/70">
                {parseFloat(balance.ar).toFixed(4)} AR
              </span>
            ) : (
              <span className="loading loading-spinner loading-xs" />
            )}
          </span>
        </div>
      </div>

      <div data-tip="Disconnect Wallet" className="tooltip">
        <button
          className="btn btn-square btn-error btn-sm rounded-md"
          disabled={isPendingDisconnect}
          onClick={onClickDisconnect}
        >
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
              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
