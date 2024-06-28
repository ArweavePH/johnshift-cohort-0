import toast from 'react-hot-toast';

import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

import { useMutation } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { GenericResponse } from '~/core/types';

interface Payload {
  gameId: string;
  wallet: string;
  questionId: string;
  selectedAnswer: string;
  elapsedTime: number;
}

const submitAnswer = async (payload: Payload) => {
  const messageId = await message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'SubmitAnswer' }],
    data: JSON.stringify(payload),
  });

  const response = await result({
    message: messageId,
    process: AOS_PROCESS_ID,
  }).then((res) => JSON.parse(res.Messages[0].Data) as GenericResponse<number>);

  if (!response.success) throw new Error(response.message);

  return response.data;
};

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (payload: Payload) => submitAnswer(payload),
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
