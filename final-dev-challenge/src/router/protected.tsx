import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSetAtom } from 'jotai';

import { previousPathAtom } from '~/core/atoms';
import { useAddress } from '~/hooks/use-address';
import { useConnection } from '~/hooks/use-connection';
import { useUser } from '~/hooks/use-user';
import { LoadingPage } from '~/pages/loading-page';

export const Protected = () => {
  const { isPending } = useConnection();
  const { address, isReady } = useAddress();
  const { data: userData } = useUser(address);

  const { pathname } = useLocation();
  const setPreviousPath = useSetAtom(previousPathAtom);

  if (isPending || !isReady) return <LoadingPage />;
  if (!address) return <Navigate replace to="/login" />;
  if (!userData) return <LoadingPage />;

  if (!userData.success && userData.message === 'User not found') {
    setPreviousPath(pathname === '/set-nickname' ? '/' : pathname);
    return <Navigate to="/set-nickname" />;
  }

  return <Outlet />;
};
