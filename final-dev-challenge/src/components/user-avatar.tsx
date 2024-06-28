import { ClassValue } from 'clsx';

import { AVATAR_PREFIX } from '~/core/constants';
import { cn } from '~/utils/cn';

interface Props {
  wallet: string;
  className?: ClassValue;
}

export const UserAvatar = ({ wallet, className }: Props) => {
  return (
    <div className="avatar">
      <div className={cn('w-12 rounded-full', className)}>
        <img src={`${AVATAR_PREFIX}${wallet}`} />
      </div>
    </div>
  );
};
