/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

import { cn } from '@/utils/cn';
import { formatAddress } from '@/utils/format-address';
import { useBalance } from '@/hooks/use-balance';
import { useConnectWallet } from '@/hooks/use-connect-wallet';
import { useDisconnect } from '@/hooks/use-disconnect';
import { useUserAddress } from '@/hooks/use-user-address';

import { PollForm } from './poll-form';

export const Nav = () => {
  const { data: address } = useUserAddress();
  const { data: balance } = useBalance();

  const { mutate: disconnect, isPending: isPendingDisconnect } =
    useDisconnect();
  const onClickDisconnect = () => {
    disconnect();
  };

  const { mutate: connectWallet, isPending: isPendingConnect } =
    useConnectWallet();
  const onClickConnect = () => {
    connectWallet();
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="fixed left-0 top-0 z-50 flex h-20 w-screen items-center justify-center bg-base-300">
      <div className="flex size-full max-w-2xl items-center justify-between p-4">
        <div className="flex flex-col space-y-0">
          <span className="text-xl font-bold text-neutral-content">
            ArweavePH 🇵🇭
          </span>
          <span className="text-xs text-white/60">Lesson 3.5</span>
        </div>
        {!address ? (
          <button
            className="btn bg-neutral/40"
            onClick={onClickConnect}
            disabled={isPendingConnect || !!address}
          >
            {isPendingConnect && <span className="loading loading-spinner" />}
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              className={cn('btn w-48 bg-neutral/80', {
                'btn-error': isHovering,
              })}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() =>
                (document.getElementById('disconnect-modal') as any).showModal()
              }
            >
              {isHovering ? (
                <p>Disconnect</p>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-end">
                    <span className="text-xs font-bold">
                      {formatAddress(address)}
                    </span>
                    <span className="text-xs font-bold text-white/60">
                      {balance ? (
                        <span>{parseFloat(balance.ar).toFixed(4)} AR</span>
                      ) : (
                        <span className="loading loading-spinner loading-xs" />
                      )}
                    </span>
                  </div>
                  <div className="avatar">
                    <div className="w-8 rounded-full ring ring-slate-600 ring-offset-2 ring-offset-base-100">
                      <img
                        alt={address}
                        src={`https://api.dicebear.com/8.x/bottts/svg?seed=${address}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </button>
            <PollForm />
          </div>
        )}
      </div>

      <dialog id="disconnect-modal" className="modal">
        <div className="modal-box max-w-sm space-y-4">
          <h3 className="text-lg font-bold">Disconnect Wallet?</h3>
          <div className="flex w-full justify-end">
            <button
              className="btn btn-error btn-sm rounded-md"
              disabled={isPendingDisconnect}
              onClick={onClickDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
