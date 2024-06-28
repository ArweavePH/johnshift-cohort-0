import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { previousPathAtom } from '~/core/atoms';
import { AOS_PROCESS_ID } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';
import { GenericResponse } from '~/core/types';

interface Payload {
  wallet: string;
  name: string;
}

const upsertUser = async (payload: Payload) => {
  const messageId = await message({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'UpsertUser' }],
    data: JSON.stringify(payload),
  });

  const response = await result({
    message: messageId,
    process: AOS_PROCESS_ID,
  }).then((res) => JSON.parse(res.Messages[0].Data) as GenericResponse);

  if (!response.success) throw new Error(response.message);
};

export const useUpsertUser = () => {
  const navigate = useNavigate();
  const [previousPath, setPreviousPath] = useAtom(previousPathAtom);
  return useMutation({
    mutationFn: (payload: Payload) => upsertUser(payload),
    onError: (error) => toast.error(error.message),
    onSuccess: async (_, { wallet }) => {
      const queryKey = queryKeys.getUser(wallet);
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });

      const path = previousPath || '/';
      setPreviousPath(null);
      navigate(path);
    },
  });
};
