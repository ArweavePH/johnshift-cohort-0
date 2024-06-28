import { PageCentered } from '~/components/page-centered';

interface Props {
  countdown: number;
}

export const CountdownPage = ({ countdown }: Props) => {
  return (
    <PageCentered>
      <span className="countdown font-mono text-6xl">
        {countdown > 0 ? (
          <span style={{ ['--value' as string]: countdown }}></span>
        ) : (
          'GO!'
        )}
      </span>
    </PageCentered>
  );
};
