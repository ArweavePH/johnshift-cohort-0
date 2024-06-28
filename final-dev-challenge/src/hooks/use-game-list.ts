import { createDataItemSigner, dryrun } from '@permaweb/aoconnect';

import { useQuery } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryKeys } from '~/core/query-keys';
import { GameListItem, GenericResponse } from '~/core/types';

const getGameItems = async () =>
  dryrun({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'GetAllGameIds' }],
  }).then(
    (res) =>
      JSON.parse(res.Messages[0].Data) as GenericResponse<GameListItem[]>,
  );

export const useGameList = () => {
  return useQuery({
    queryKey: queryKeys.getGameIds(),
    queryFn: async () => getGameItems(),
    refetchInterval: 1000,
    select: (data) => data.data.sort((a, b) => b.timeCreated - a.timeCreated),
  });
};
