import Arweave from 'arweave';

import { QueryClient } from '@tanstack/react-query';

import {
  CircleIcon,
  DiamondIcon,
  SquareIcon,
  TriangleIcon,
} from '~/components/icons';

export const arweave = new Arweave({
  host: 'ar-io.net',
  port: 443,
  protocol: 'https',
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1hr
    },
  },
});

export const CHOICES_SHAPE = {
  0: <TriangleIcon />,
  1: <DiamondIcon />,
  2: <CircleIcon />,
  3: <SquareIcon />,
} as const;

export type ChoicesKey = keyof typeof CHOICES_SHAPE;
