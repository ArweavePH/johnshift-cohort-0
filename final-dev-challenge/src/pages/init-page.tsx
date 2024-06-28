import { HostGameForm } from '~/components/host-game-form';
import { JoinGameForm } from '~/components/join-game-form';
import { PageCentered } from '~/components/page-centered';

const TITLE = 'HELLO';

export const InitPage = () => {
  return (
    <PageCentered className="flex-col space-y-8">
      <h2 className="text-center text-7xl font-bold">{TITLE}</h2>
      <div className="flex max-w-xs flex-col justify-center space-y-8">
        <JoinGameForm />
        <div className="divider">or</div>
        <HostGameForm />
      </div>
    </PageCentered>
  );
};
