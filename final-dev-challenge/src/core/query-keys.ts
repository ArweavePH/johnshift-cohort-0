export const queryKeys = {
  all: ['all'] as const,
  getGame: (id: string) => [...queryKeys.all, 'getGame', id] as const,
  getUser: (wallet: string) => [...queryKeys.all, 'getUser', wallet] as const,
  getGameIds: () => [...queryKeys.all, 'getGameIds'] as const,
};
