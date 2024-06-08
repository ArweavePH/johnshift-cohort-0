import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '~/core/query-keys';

const getUserAddress = async () => window.arweaveWallet.getActiveAddress();

export const useUserAddress = () =>
  useQuery({
    queryKey: queryKeys.userAddress(),
    queryFn: () => getUserAddress(),
  });
