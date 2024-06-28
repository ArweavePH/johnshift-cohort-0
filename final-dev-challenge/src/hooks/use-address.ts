import { useEffect, useState } from 'react';

import { useActiveAddress } from 'arweave-wallet-kit';

export const READY_DELAY = 400;

export const useAddress = () => {
  const [isReady, setIsReady] = useState(false);
  const address = useActiveAddress();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return { isReady, address };
};
