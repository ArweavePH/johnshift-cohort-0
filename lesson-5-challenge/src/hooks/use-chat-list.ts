import { createDataItemSigner, dryrun } from '@permaweb/aoconnect';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { AOS_PROCESS_ID } from '~/core/constants';
import { QueryKeys, queryKeys } from '~/core/query-keys';
import { Chat } from '~/core/types';

const DEFAULT_LIMIT = 20;

const getChatList = async (
  roomId: string,
  cursor: number,
  limit = DEFAULT_LIMIT,
) =>
  dryrun({
    process: AOS_PROCESS_ID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [{ name: 'Action', value: 'GetChats' }],
    data: JSON.stringify({ roomId, cursor, limit }),
  }).then((res) => JSON.parse(res.Messages[0].Data));

interface ChatListQueryPage {
  nextCursor: number;
  data: Chat[];
}

export const useChatList = (roomId?: string) => {
  return useInfiniteQuery<
    ChatListQueryPage,
    Error,
    InfiniteData<ChatListQueryPage, number>,
    ReturnType<QueryKeys['getChatList']>,
    number
  >({
    queryKey: queryKeys.getChatList(roomId!),
    queryFn: async ({ pageParam = 1 }) => getChatList(roomId!, pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ nextCursor, data }) => {
      return nextCursor > 0 && data.length > 0 ? nextCursor : undefined;
    },
    enabled: !!roomId,
    refetchInterval: 1000,
  });
};
