import { PageCentered } from '~/components/page-centered';

interface Props {
  message?: string;
}

export const LoadingPage = ({ message }: Props) => {
  return (
    <PageCentered>
      <div className="flex flex-col items-center space-y-8">
        <span className="loading loading-spinner loading-lg text-accent" />
        {message && (
          <span className="text-2xl font-bold text-neutral-content/80">
            {message}
          </span>
        )}
      </div>
    </PageCentered>
  );
};
