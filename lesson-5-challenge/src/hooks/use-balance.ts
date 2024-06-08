import { useQuery } from '@tanstack/react-query';

import { arweave } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';

const getBalance = async (address: string) =>
  arweave.wallets.getBalance(address);

export const useBalance = (address: string) => {
  return useQuery({
    queryKey: queryKeys.getBalance(address),
    queryFn: () => getBalance(address!),
    select: (data: string) => ({
      winston: data,
      ar: arweave.ar.winstonToAr(data),
    }),
  });
};
