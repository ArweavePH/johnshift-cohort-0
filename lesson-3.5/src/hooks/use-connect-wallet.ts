import { useMutation } from '@tanstack/react-query';
import { AppInfo, PermissionType } from 'arconnect';

import { queryClient } from '@/core/misc';
import { queryKeys } from '@/core/query-keys';

const permissions: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'DISPATCH',
  'SIGNATURE',
  'SIGN_TRANSACTION',
];

// TODO
const appInfo: AppInfo = {
  name: 'ArweavePH Lesson 03',
  logo: 'https://y2aemc2da6p4x3jkk5nhypljbujlvtywli53d52pnc5pqsbdbxza.arweave.net/xoBGC0MHn8vtKldafD1pDRK6zxZaO7H3T2i6-EgjDfI',
};

const connectWallet = async () =>
  window.arweaveWallet.connect(permissions, appInfo);

export const useConnectWallet = () => {
  return useMutation({
    mutationFn: () => connectWallet(),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.all,
      });
    },
  });
};
