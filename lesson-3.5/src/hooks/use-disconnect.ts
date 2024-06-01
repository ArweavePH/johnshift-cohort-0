import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/core/misc';
import { queryKeys } from '@/core/query-keys';

const disconnectWallet = async () => window.arweaveWallet.disconnect();

export const useDisconnect = () => {
  return useMutation({
    mutationFn: () => disconnectWallet(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.all,
      });
      location.reload();
    },
  });
};
