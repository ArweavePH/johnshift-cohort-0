import { QueryClient } from '@tanstack/react-query';
import Arweave from 'arweave';

export const arweave = new Arweave({
  host: 'ar-io.net',
  port: 443,
  protocol: 'https',
});

// Queryclient for browser (static export -> client only)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1hr
    },
  },
});
