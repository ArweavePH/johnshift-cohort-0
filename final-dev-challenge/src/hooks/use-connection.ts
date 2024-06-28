import { useConnection as useWalletKitConnection } from 'arweave-wallet-kit';

import { useMutation } from '@tanstack/react-query';

export const useConnection = () => {
  const { connect: walletKitConnect, disconnect: walletKitDisconnect } =
    useWalletKitConnection();

  const { mutate: connectMutation, isPending: isPendingConnect } = useMutation({
    mutationFn: walletKitConnect,
  });

  const { mutate: disconnectMutation, isPending: isPendingDisconnect } =
    useMutation({
      mutationFn: walletKitDisconnect,
    });

  return {
    isPending: isPendingConnect || isPendingDisconnect,
    connect: () => connectMutation(),
    disconnect: () => disconnectMutation(),
  };
};
