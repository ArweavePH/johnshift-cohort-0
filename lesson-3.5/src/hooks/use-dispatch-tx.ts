import { useMutation } from '@tanstack/react-query';

import { APP_NAME, APP_VERSION } from '@/core/constants';
import { arweave } from '@/core/misc';

interface Payload {
  address: string;
  message: string;
}

const dispatchTx = async ({ address, message }: Payload) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify({ message, timestamp: Date.now() }),
  });
  tx.addTag('Content-type', 'application/json');
  tx.addTag('app-name', APP_NAME);
  tx.addTag('app-version', APP_VERSION);
  tx.addTag('author', address!);
  await window.arweaveWallet.dispatch(tx);
};

export const useDispatchTx = () => {
  return useMutation({
    mutationFn: (payload: Payload) => dispatchTx(payload),
    onSuccess: () => {
      // TODO: Optimistic add to post-feed + insert query-data to post-item
    },
  });
};
