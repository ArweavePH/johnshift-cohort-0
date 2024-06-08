import { createDataItemSigner, message } from '@permaweb/aoconnect';
import { useMutation } from '@tanstack/react-query';
import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';

interface Payload {
  user: string;
  shouldAdd: boolean;
  id: string;
}

const updateOnlineStatus = async ({ id, user, shouldAdd }: Payload) => {
  console.log('updateOnlineStatus', { id, user, shouldAdd });
  return message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      {
        name: 'Action',
        value: shouldAdd ? 'AddOnlineUser' : 'RemoveOnlineUser',
      },
    ],
    data: JSON.stringify({ id, user }),
  });
};

export const useUpdateOnlineStatus = () => {
  return useMutation({
    mutationFn: (payload: Payload) => updateOnlineStatus(payload),
    onSuccess: async () => {
      const queryKey = queryKeys.getRooms();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
  });
};
