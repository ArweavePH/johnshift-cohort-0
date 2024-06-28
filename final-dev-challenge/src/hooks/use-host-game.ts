import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

import { useMutation } from '@tanstack/react-query';

import { AOS_PROCESS_ID, MODAL_IDS } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { Category, Game, GenericResponse } from '~/core/types';

interface Payload {
  id: string;
  category: Category;
  host: string;
  timeLimit: number;
  timeCreated: number;
}

const hostGame = async (payload: Payload) => {
  const messageId = await message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'CreateGame' }],
    data: JSON.stringify(payload),
  });

  const response = await result({
    message: messageId,
    process: AOS_PROCESS_ID,
  }).then((res) => JSON.parse(res.Messages[0].Data) as GenericResponse<Game>);

  if (!response.success) throw new Error(response.message);
};

export const useHostGame = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: Payload) => hostGame(payload),
    onError: (error) => toast.error(error.message),
    onSuccess: async (_, { id }) => {
      const dialogElement = document.getElementById(
        MODAL_IDS.SELECT_CATEGORY,
      ) as HTMLDialogElement | null;

      if (dialogElement) {
        dialogElement.close();
      }

      const queryKey = queryKeys.getGameIds();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });

      navigate(`games/${id}`);
      toast.success('Game created!');
    },
  });
};
