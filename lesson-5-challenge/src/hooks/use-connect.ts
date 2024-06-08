import { useMutation } from '@tanstack/react-query';
import { AppInfo, PermissionType } from 'arconnect';

import { LOGO_URL } from '~/core/constants';
import { queryClient } from '~/core/misc';
import { queryKeys } from '~/core/query-keys';

const permissions: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'DISPATCH',
  'SIGNATURE',
  'SIGN_TRANSACTION',
];

// TODO
const appInfo: AppInfo = {
  name: 'Arweave TG Clone',
  logo: LOGO_URL,
};

const connectWallet = async () =>
  window.arweaveWallet.connect(permissions, appInfo);

export const useConnect = () => {
  return useMutation({
    mutationFn: () => connectWallet(),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.all,
      });
    },
  });
};
