import toast from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';

import { APP_FEATURES, APP_NAME, APP_VERSION } from '@/core/constants';
import { arweave } from '@/core/misc';

interface Payload {
  address: string;
  title: string;
  options: string[];
}

// Dispatch tx to arweave
const dispatchTx = async ({ address, title, options }: Payload) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify({ title, options, timestamp: Date.now() }),
  });
  tx.addTag('Content-type', 'application/json');
  tx.addTag('app-name', APP_NAME);
  tx.addTag('app-version', APP_VERSION);
  tx.addTag('app-feature', APP_FEATURES.FEED);
  tx.addTag('author', address);
  await window.arweaveWallet.dispatch(tx);
};

export const useCreatePoll = () => {
  return useMutation({
    mutationFn: (payload: Payload) => dispatchTx(payload),
    onSuccess: () => {
      toast.success('Success! Your poll will be posted shortly');
    },
  });
};
