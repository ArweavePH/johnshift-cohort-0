import toast from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';

import { APP_FEATURES, APP_NAME, APP_VERSION } from '@/core/constants';
import { arweave, queryClient } from '@/core/misc';
import { queryKeys } from '@/core/query-keys';

interface Payload {
  pollId: string;
  owner: string;
  selection: string;
}

const dispatchTx = async ({ pollId, owner, selection }: Payload) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify({ owner, selection, timestamp: Date.now() }),
  });
  tx.addTag('Content-type', 'application/json');
  tx.addTag('app-name', APP_NAME);
  tx.addTag('app-version', APP_VERSION);
  tx.addTag('app-feature', APP_FEATURES.POLL_SELECTION);
  tx.addTag('poll-id', pollId);
  await window.arweaveWallet.dispatch(tx);
};

export const useSubmitSelection = () => {
  return useMutation({
    mutationFn: (payload: Payload) => dispatchTx(payload),
    onMutate: async ({ pollId, owner, selection }) => {
      const queryKey = queryKeys.getPollSelections(pollId);
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => [
        ...old,
        {
          id: pollId,
          owner,
          selection,
          timestamp: Date.now(),
          txTimestamp: null,
        },
      ]);

      return { prev };
    },
    onSuccess: (_data, { selection }) => {
      toast.success(
        `You voted "${
          selection.length > 20 ? selection.slice(0, 20) + '...' : selection
        }"`,
      );
    },
    onError: (_err, { pollId }, ctx) => {
      queryClient.setQueryData(queryKeys.getPollSelections(pollId), ctx?.prev);
    },
    onSettled: async (_data, _error, { pollId }) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getPollSelections(pollId),
      });
      await queryClient.refetchQueries({
        queryKey: queryKeys.getPollSelections(pollId),
      });
    },
  });
};
