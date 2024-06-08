import { createDataItemSigner, dryrun } from '@permaweb/aoconnect';
import { useQuery } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryKeys } from '~/core/query-keys';
import { Room } from '~/core/types';

const getRooms = async () =>
  dryrun({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'GetRooms' }],
  }).then((res) => JSON.parse(res.Messages[0].Data) as Room[]);

export const useRooms = () => {
  return useQuery({
    queryKey: queryKeys.getRooms(),
    queryFn: async () => getRooms(),
    refetchInterval: 5000,
  });
};
