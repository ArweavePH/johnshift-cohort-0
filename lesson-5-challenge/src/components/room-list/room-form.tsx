import { useState } from 'react';

import { uid } from 'uid';

import { useCreateRoom } from '~/hooks/use-create-room';
import { useUserAddress } from '~/hooks/use-user-address';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CHATROOM_MODAL_ID = 'chatroom-form-modal';

export const ChatroomForm = () => {
  const { data: address } = useUserAddress();
  const [name, setName] = useState('');

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const { mutate, isPending } = useCreateRoom();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (address) {
      mutate(
        {
          id: uid(),
          admin: address,
          name,
          timestamp: Date.now(),
        },
        {
          onSuccess: () => {
            setName('');
            closeModal();
          },
        },
      );
    }
  };

  const openModal = () =>
    (document.getElementById(CHATROOM_MODAL_ID) as any).showModal();

  const closeModal = () =>
    (document.getElementById(CHATROOM_MODAL_ID) as any).close();

  const isLoading = isPending || !address;

  return (
    <>
      <button
        disabled={!address}
        className="btn bg-neutral"
        onClick={openModal}
      >
        Create Chat Room
      </button>

      <dialog id={CHATROOM_MODAL_ID} className="modal">
        <div className="modal-box max-w-md">
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Room Name"
              className="input input-lg input-bordered w-full"
              disabled={isLoading}
              value={name}
              onChange={onChange}
            />

            <button
              type="submit"
              className="btn btn-md w-full bg-neutral px-6"
              disabled={isLoading || !name}
            >
              Create Room
            </button>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
