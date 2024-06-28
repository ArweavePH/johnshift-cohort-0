import { Navigate } from 'react-router-dom';

import { useAddress } from '~/hooks/use-address';
import { useConnection } from '~/hooks/use-connection';
import { PageCentered } from '~/components/page-centered';

import { LoadingPage } from './loading-page';

export const LoginPage = () => {
  const { isReady, address } = useAddress();
  const { isPending, connect } = useConnection();

  if (isPending || !isReady) return <LoadingPage />;
  if (address) return <Navigate to="/" />;

  return (
    <PageCentered>
      <button disabled={isPending} className="btn btn-lg" onClick={connect}>
        {isPending && <span className="loading loading-spinner" />}
        <span>Connect Wallet</span>
      </button>
    </PageCentered>
  );
};
