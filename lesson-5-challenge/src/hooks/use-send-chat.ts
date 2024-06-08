import { createDataItemSigner, message } from '@permaweb/aoconnect';
import { useMutation } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { Chat } from '~/core/types';

const sendChat = async (chat: Chat) => {
  return message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'SendChat' }],
    data: JSON.stringify(chat),
  });
};

export const useSendChat = () => {
  return useMutation({
    mutationFn: (chat: Chat) => sendChat(chat),
    onSuccess: async (_data, { roomId }) => {
      const queryKey = queryKeys.getChatList(roomId);
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
  });
};
