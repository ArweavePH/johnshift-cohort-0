import { RouterProvider } from 'react-router-dom';

import { AppInfo, PermissionType } from 'arconnect';
import { ArweaveWalletKit } from 'arweave-wallet-kit';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '~/core/misc';

import { router } from './router';

const WALLET_PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'DISPATCH',
  'SIGNATURE',
  'SIGN_TRANSACTION',
];

const APP_INFO: AppInfo = {
  name: 'Arweave Wallet Kit',
  logo: 'https://ctrjmfuctajkmy7rpk53hbzjq2eyzphuseuyifd5l3kemke5aadq.arweave.net/FOKWFoKYEqZj8Xq7s4cphomMvPSRKYQUfV7URiidAAc',
};

const App = () => {
  return (
    <ArweaveWalletKit
      config={{
        ensurePermissions: true,
        permissions: WALLET_PERMISSIONS,
        appInfo: APP_INFO,
      }}
      theme={{
        displayTheme: 'dark',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ArweaveWalletKit>
  );
};

export default App;
