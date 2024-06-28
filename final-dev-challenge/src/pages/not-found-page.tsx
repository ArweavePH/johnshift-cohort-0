import { useNavigate } from 'react-router-dom';

import { Nav } from '~/components/nav';
import { PageCentered } from '~/components/page-centered';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Nav
        pageAction={
          <button className="btn btn-accent" onClick={() => navigate('/')}>
            BACK TO HOME
          </button>
        }
      />
      <PageCentered>
        <span className="text-4xl font-bold">NOT FOUND</span>
      </PageCentered>
    </>
  );
};
