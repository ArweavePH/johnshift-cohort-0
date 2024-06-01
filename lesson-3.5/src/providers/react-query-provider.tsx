'use client';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/core/misc';

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
