import { useQuery } from '@tanstack/react-query';

import { arweave } from '@/core/misc';
import { queryKeys } from '@/core/query-keys';

import { useUserAddress } from './use-user-address';

const getBalance = async (address: string) =>
  arweave.wallets.getBalance(address);

export const useBalance = () => {
  const { data: address } = useUserAddress();
  return useQuery({
    queryKey: queryKeys.getBalance(address),
    queryFn: () => getBalance(address!),
    enabled: !!address,
    select: (data: string) => ({
      winston: data,
      ar: arweave.ar.winstonToAr(data),
    }),
  });
};
