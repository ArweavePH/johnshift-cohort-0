export const queryKeys = {
  all: ['all'] as const,
  userAddress: () => [...queryKeys.all, 'user-address'] as const,
  getBalance: (address: string | undefined) =>
    [...queryKeys.all, 'get-balance', address] as const,
  getPosts: () => [...queryKeys.all, 'get-posts'] as const,
  getPollSelections: (pollId: string) => [
    ...queryKeys.all,
    'get-user-poll-selection',
    pollId,
  ],
};
