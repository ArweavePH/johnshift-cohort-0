import { createDataItemSigner, message } from '@permaweb/aoconnect';
import { useMutation } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { Room } from '~/core/types';

interface Payload extends Omit<Room, 'admin' | 'online'> {
  admin: string;
}

const createRoom = async (room: Payload) => {
  return message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'CreateRoom' }],
    data: JSON.stringify(room),
  });
};

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: (room: Payload) => createRoom(room),
    onSuccess: async () => {
      const queryKey = queryKeys.getRooms();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
  });
};
