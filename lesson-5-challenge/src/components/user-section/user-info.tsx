import { Info } from './info';

import { AVATAR_PREFIX } from '~/core/constants';
import { useBalance } from '~/hooks/use-balance';
import { formatAddress } from '~/utils/format-address';

interface Props {
  address: string;
  isPending: boolean;
  connectButton: React.ReactNode;
}

export const UserInfo = ({ address, isPending, connectButton }: Props) => {
  const { data: balance } = useBalance(address);

  if (!address) return null;

  return (
    <Info
      isPending={isPending}
      imageSrc={`${AVATAR_PREFIX}${address}`}
      name={formatAddress(address)}
      info={
        <span className="text-xs text-white/60">
          {balance ? (
            <span className="font-bold">
              {/* {parseFloat(balance.ar).toFixed(4)} AR */}
              {parseFloat(balance.winston)} Winston
            </span>
          ) : (
            <span className="loading loading-bars loading-xs max-h-3" />
          )}
        </span>
      }
      connectButton={connectButton}
    />
  );
};
