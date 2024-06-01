'use client';

import { useState } from 'react';

import Arweave from 'arweave';

import { queryClient } from '@/core/misc';
import { queryKeys } from '@/core/query-keys';
import { cn } from '@/utils/cn';
import { useDispatchTx } from '@/hooks/use-dispatch-tx';
import { useUserAddress } from '@/hooks/use-user-address';

// create arweave client
const arweave = new Arweave({
  host: 'ar-io.net',
  port: 443,
  protocol: 'https',
});

export const PostForm = () => {
  const { data: address } = useUserAddress();

  const [message, setMessage] = useState('');
  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  const { mutate, isPending } = useDispatchTx();

  const canDispatchTx = address && message;

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (canDispatchTx) {
      mutate(
        { address: address, message },
        {
          onSuccess: () => {
            setMessage('');
            queryClient.invalidateQueries({
              queryKey: queryKeys.getPosts(),
            });
          },
        },
      );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div
        data-tip="Please connect your wallet"
        className={cn('w-full', { tooltip: !address })}
      >
        <textarea
          disabled={!address || isPending}
          rows={6}
          placeholder="What's on your mind?"
          className="textarea textarea-bordered w-full"
          value={message}
          onChange={onChange}
        />
      </div>
      <div className="flex w-full justify-end">
        <button
          className="btn btn-sm px-6"
          disabled={!canDispatchTx || isPending}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            'Post'
          )}
        </button>
      </div>
    </form>
  );
};
