import { ClassValue } from 'clsx';

import { cn } from '~/utils/cn';

interface Props {
  title: string;
  value: string;
  className?: ClassValue;
}

export const Stat = ({ title, value, className }: Props) => (
  <div className={cn('flex shrink-0 flex-col gap-1 p-2', className)}>
    <div className="text-sm text-white/70">{title}</div>
    <div className="text-4xl font-bold">{value}</div>
  </div>
);
