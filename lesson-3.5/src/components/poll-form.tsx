'use client';

import { useState } from 'react';

import { queryClient } from '@/core/misc';
import { queryKeys } from '@/core/query-keys';
import { useCreatePoll } from '@/hooks/use-create-poll';
import { useUserAddress } from '@/hooks/use-user-address';

export const PollForm = () => {
  const { data: address } = useUserAddress();

  const [title, setTitle] = useState('');
  const onChangeTitle: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setTitle(e.target.value);
  };

  const [currentOption, setCurrentOption] = useState('');
  const onChangeOption: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentOption(e.target.value);
  };

  const [options, setOptions] = useState<string[]>([]);

  const addOption = () => {
    const isDuplicate = options.includes(currentOption);
    if (isDuplicate) {
      alert('Already in the list');
      setCurrentOption('');
      return;
    }

    setOptions((prev) => [...prev, currentOption]);
    setCurrentOption('');
  };

  const removeOption = (option: string) => {
    setOptions((prev) => prev.filter((o) => o !== option));
  };

  const { mutate, isPending } = useCreatePoll();
  const canCreatePoll = address && title && options.length > 1;

  const openModal = () =>
    (document.getElementById('poll-form-modal') as any).showModal();

  const closeModal = () =>
    (document.getElementById('poll-form-modal') as any).close();

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (canCreatePoll) {
      mutate(
        { address, title, options },
        {
          onSuccess: () => {
            setTitle('');
            setOptions([]);
            queryClient.invalidateQueries({
              queryKey: queryKeys.getPosts(),
            });
            closeModal();
          },
        },
      );
    }
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Create Poll">
        <button className="btn btn-square bg-neutral/80" onClick={openModal}>
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </div>
      <dialog id="poll-form-modal" className="modal">
        <div className="modal-box max-w-md">
          <form onSubmit={onSubmit} className="space-y-4">
            <textarea
              rows={1}
              placeholder="Poll Title"
              className="textarea textarea-bordered textarea-sm w-full"
              disabled={!address || isPending}
              value={title}
              onChange={onChangeTitle}
            />

            {options.length > 0 && (
              <div>
                {options.map((option, i) => (
                  <div key={`${option}${i}`} className="form-control">
                    <label className="label justify-start gap-4">
                      <input
                        readOnly
                        type="radio"
                        name={option}
                        className="radio radio-sm"
                        checked={false}
                      />
                      <span className="label-text">{option}</span>
                      <button
                        type="button"
                        className="btn btn-square btn-xs"
                        onClick={() => removeOption(option)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex w-full items-center justify-between gap-2">
              <input
                placeholder="Add Option"
                className="input input-sm input-bordered w-full placeholder:text-xs"
                disabled={!address || isPending}
                value={currentOption}
                onChange={onChangeOption}
              />
              <button
                type="button"
                className="btn btn-square btn-sm"
                disabled={!currentOption}
                onClick={addOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full pt-4">
              <button
                type="submit"
                className="btn btn-md w-full px-6"
                disabled={!canCreatePoll || isPending}
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
