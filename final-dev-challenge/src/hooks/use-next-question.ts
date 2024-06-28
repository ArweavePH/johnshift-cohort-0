import toast from 'react-hot-toast';

import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

import { useMutation } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { GenericResponse, Question } from '~/core/types';

const nextQuestion = async (gameId: string) => {
  const messageId = await message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'NextQuestion' }],
    data: JSON.stringify({ gameId, timestamp: Date.now() }),
  });

  const response = await result({
    message: messageId,
    process: AOS_PROCESS_ID,
  }).then(
    (res) => JSON.parse(res.Messages[0].Data) as GenericResponse<Question>,
  );

  if (!response.success) throw new Error(response.message);

  return response.data;
};

export const useNextQuestion = (gameId: string) => {
  return useMutation({
    mutationFn: () => nextQuestion(gameId),
    onSuccess: async () => {
      const queryKey = queryKeys.getGame(gameId);
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
};
