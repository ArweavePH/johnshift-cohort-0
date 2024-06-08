export const queryKeys = {
  all: ['all'] as const,
  userAddress: () => [...queryKeys.all, 'user-address'] as const,
  getBalance: (address: string | undefined) =>
    [...queryKeys.all, 'get-balance', address] as const,
  getChatList: (roomId: string) =>
    [...queryKeys.all, 'get-chat-list', roomId] as const,
  getRooms: () => [...queryKeys.all, 'get-rooms'] as const,
};

export type QueryKeys = typeof queryKeys;
