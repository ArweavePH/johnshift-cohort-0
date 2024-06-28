import { PageCentered } from '~/components/page-centered';

import { NotFoundPage } from './not-found-page';

interface Props {
  message: string;
  notFoundMessage?: string;
}

export const ErrorPage = ({ message, notFoundMessage }: Props) => {
  if (message === notFoundMessage) return <NotFoundPage />;

  return (
    <PageCentered>
      <div className="flex flex-col gap-8">
        <span>Oh no!</span>
        <span>{message}</span>
      </div>
    </PageCentered>
  );
};
