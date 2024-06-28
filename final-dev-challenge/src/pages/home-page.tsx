import { HostGameForm } from '~/components/host-game-form';
import { JoinGameForm } from '~/components/join-game-form';
import { Nav } from '~/components/nav';
import { PageCentered } from '~/components/page-centered';

const TITLE = 'KADYUT!';

export const HomePage = () => {
  return (
    <>
      <Nav
        content={
          <h2 className="text-center text-4xl font-bold text-accent">
            {TITLE}
          </h2>
        }
        pageAction={<HostGameForm />}
      />
      <PageCentered className="flex-col space-y-8">
        <JoinGameForm />
      </PageCentered>
    </>
  );
};
