import toast from 'react-hot-toast';

import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

import { useMutation } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { GameState, GenericResponse } from '~/core/types';

interface Payload {
  gameId: string;
  state: GameState;
}

const updateGameState = async ({ gameId, state }: Payload) => {
  const messageId = await message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'UpdateGameState' }],
    data: JSON.stringify({ gameId, state }),
  });

  const response = await result({
    message: messageId,
    process: AOS_PROCESS_ID,
  }).then((res) => JSON.parse(res.Messages[0].Data) as GenericResponse);

  if (!response.success) throw new Error(response.message);

  return response.data;
};

export const useUpdateGameState = () => {
  return useMutation({
    mutationFn: (payload: Payload) => updateGameState(payload),
    onSuccess: async (_, { gameId }) => {
      const queryKey = queryKeys.getGame(gameId);
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
};
