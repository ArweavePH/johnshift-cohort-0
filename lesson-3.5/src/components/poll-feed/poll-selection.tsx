'use client';

import { useEffect, useState } from 'react';

import { PollItem } from '@/core/types';
import { cn } from '@/utils/cn';
import { usePollSelections } from '@/hooks/use-poll-selections';
import { useSubmitSelection } from '@/hooks/use-submit-selection';
import { useUserAddress } from '@/hooks/use-user-address';

interface Props {
  poll: PollItem;
}

export const PollSelection = ({ poll }: Props) => {
  const { data: address } = useUserAddress();
  const { id, owner, title, options } = poll;

  const { data, isRefetching } = usePollSelections(id);

  const [currentSelection, setCurrentSelection] = useState('');

  // Sync last selection by owner
  useEffect(() => {
    if (!currentSelection && data && address) {
      const prevSelections = data.selections
        .filter((d) => d.owner === address)
        .sort((a, b) => b.timestamp - a.timestamp);
      if (prevSelections.length > 0) {
        console.log({ prevSelections });
        setCurrentSelection(prevSelections[0].selection);
      }
    }
  }, [currentSelection, data, isRefetching, address]);

  const { mutate, isPending } = useSubmitSelection();
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value;
    setCurrentSelection(newValue);
    mutate({
      pollId: id,
      owner,
      selection: newValue,
    });
  };

  if (!data) return <p>Loading poll ...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {(options ?? []).map((option, i) => {
        const value = data.selectionCount[option] ?? 0;
        const isLoading = isRefetching || isPending;
        const percentage = (value / data.totalCount) * 100;
        return (
          <div
            key={`${option}-${i}`}
            className={cn('container mx-auto', { tooltip: !address })}
            data-tip="Connect wallet to vote"
          >
            <div className="overflow-hidden rounded-lg bg-neutral/30">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="form-control">
                    <label
                      className={cn('label justify-start gap-4', {
                        'cursor-pointer': address,
                      })}
                    >
                      <input
                        type="radio"
                        readOnly={!address}
                        name={`${id}`}
                        className="radio radio-sm"
                        disabled={isPending || !address}
                        value={option}
                        checked={option === currentSelection}
                        onChange={onChange}
                      />
                    </label>
                  </div>

                  <div className="max-w-[16ch] truncate md:max-w-[36ch]">
                    {option}
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  {isLoading ? (
                    <span className="loading loading-bars loading-sm opacity-40" />
                  ) : data.totalCount ? (
                    `${percentage}% (${value})`
                  ) : (
                    'No votes yet'
                  )}
                </div>
              </div>

              <div className="relative h-1.5 bg-gray-700">
                <div
                  className="absolute left-0 top-0 h-full bg-primary"
                  style={{
                    width: isLoading ? undefined : `${percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
