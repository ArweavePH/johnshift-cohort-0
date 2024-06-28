import { createDataItemSigner, dryrun } from '@permaweb/aoconnect';

import { useQuery } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { queryKeys } from '~/core/query-keys';
import { Game, GenericResponse } from '~/core/types';

const getGame = async (gameId: string) =>
  dryrun({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'GetGameById' }],
    data: JSON.stringify({ gameId }),
  }).then((res) => JSON.parse(res.Messages[0].Data) as GenericResponse<Game>);

export const useGame = (gameId?: string) => {
  return useQuery({
    queryKey: queryKeys.getGame(gameId!),
    queryFn: () => getGame(gameId!),
    enabled: !!gameId,
    refetchInterval: 1000,
  });
};
