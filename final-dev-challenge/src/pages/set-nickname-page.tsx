import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useAtomValue } from 'jotai';

import { previousPathAtom } from '~/core/atoms';
import { useAddress } from '~/hooks/use-address';
import { useUpsertUser } from '~/hooks/use-upsert-user';
import { useUser } from '~/hooks/use-user';
import { EnterIcon } from '~/components/icons';
import { PageCentered } from '~/components/page-centered';

import { LoadingPage } from './loading-page';

const PLACEHOLDER = 'Enter nickname';

export const SetNicknamePage = () => {
  const { address: wallet, isReady } = useAddress();
  const { data: userData } = useUser(wallet);
  const { mutate, isPending } = useUpsertUser();
  const previousPath = useAtomValue(previousPathAtom);

  const [name, setName] = useState('');

  if (!isReady) return <LoadingPage />;
  if (!wallet) return <LoadingPage />;
  if (!userData) return <LoadingPage />;
  if (userData.success && userData.data.name) {
    return <Navigate to={previousPath || '/'} />;
  }

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!name) return;
    mutate({ wallet, name });
  };

  return (
    <PageCentered>
      <form className="card space-y-4" onSubmit={onSubmit}>
        <label className="input input-bordered flex items-center gap-2 pr-2">
          <input
            className="grow"
            placeholder={PLACEHOLDER}
            disabled={isPending}
            maxLength={16}
            value={name}
            onChange={onChange}
          />
          <button
            type="submit"
            className="btn btn-square btn-ghost btn-sm"
            disabled={isPending || !name}
          >
            {isPending ? (
              <span className="loading loading-spinner" />
            ) : (
              <EnterIcon />
            )}
          </button>
        </label>
      </form>
    </PageCentered>
  );
};
