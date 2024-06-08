import { AnonInfo } from './anon-info';
import { ConnectButton } from './connect-button';
import { UserInfo } from './user-info';

import { useUserAddress } from '~/hooks/use-user-address';

export const UserSection = () => {
  const { data: address, isPending } = useUserAddress();

  const connectButton = <ConnectButton address={address} />;

  if (!address) return <AnonInfo connectButton={connectButton} />;

  return (
    <UserInfo
      address={address}
      isPending={isPending}
      connectButton={connectButton}
    />
  );
};
