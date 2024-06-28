import { createDataItemSigner, dryrun } from '@permaweb/aoconnect';

import { useQuery } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryKeys } from '~/core/query-keys';
import { GenericResponse, User } from '~/core/types';

const getUser = async (wallet: string) =>
  dryrun({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'GetUser' }],
    data: JSON.stringify({ wallet }),
  }).then((res) => JSON.parse(res.Messages[0].Data) as GenericResponse<User>);

export const useUser = (address?: string) => {
  return useQuery({
    queryKey: queryKeys.getUser(address!),
    queryFn: () => getUser(address!),
    enabled: !!address,
    refetchInterval: 1000,
  });
};
