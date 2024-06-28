import { useState } from 'react';

import { uid } from 'uid';

import { CATEGORIES, MODAL_IDS } from '~/core/constants';
import { Category } from '~/core/types';
import { useAddress } from '~/hooks/use-address';
import { useHostGame } from '~/hooks/use-host-game';

import { CategoryButton } from './category-button';

export const SelectCategoryModal = () => {
  const [selected, setSelected] = useState<Category | null>(null);

  const setSelection = (selection: Category) => {
    const newValue = selected === selection ? null : selection;
    setSelected(newValue);
  };

  const onClose = () => setSelected(null);

  const { address: host, isReady } = useAddress();
  const { mutate: hostGame, isPending } = useHostGame();

  const isLoading = !isReady || isPending;

  const lezgo = () => {
    if (host && selected) {
      hostGame({
        id: uid(4),
        category: selected,
        host,
        timeLimit: 10,
        timeCreated: Date.now(),
      });
    }
  };

  return (
    <dialog id={MODAL_IDS.SELECT_CATEGORY} className="modal">
      <div className="modal-box w-full max-w-3xl space-y-8">
        <h3 className="text-2xl font-bold">Choose Category:</h3>
        <div className="flex gap-4">
          <CategoryButton
            isDisabled={isPending}
            category={CATEGORIES.ANIMALS}
            currentSelected={selected}
            imageUrl="https://l32mroobxihb7fu7p6kavzmqgnfuupv6t575lgb7737lau6guypq.arweave.net/XvTIucG6Dh-Wn3-UCuWQM0tKPr6ff9WYP_7-sFPGph8"
            setSelection={setSelection}
          />
          <CategoryButton
            isDisabled={isPending}
            category={CATEGORIES.PH}
            currentSelected={selected}
            imageUrl="https://vwfbu62mtp35o6lpi7ggriyewaryy6hvz7mczmfqt3cf3rag4s3q.arweave.net/rYoae0yb99d5b0fMaKMEsCOMePXP2CywsJ7EXcQG5Lc"
            setSelection={setSelection}
          />
        </div>
        <div className="flex w-full justify-center">
          <button
            type="button"
            className="btn btn-accent btn-lg max-w-xs grow"
            disabled={selected === null || isLoading}
            onClick={lezgo}
          >
            {isPending && <span className="loading loading-spinner" />}
            LEZGO
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};
