import { ClassValue } from 'clsx';

import { cn } from '~/utils/cn';

interface Props {
  children: React.ReactNode;
  className?: ClassValue;
}

export const PageCentered = ({ children, className }: Props) => {
  return (
    <div className="h-screen w-full">
      <div
        className={cn('flex h-screen items-center justify-center', className)}
      >
        {children}
      </div>
    </div>
  );
};
