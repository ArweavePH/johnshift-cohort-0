import { useConnect } from '~/hooks/use-connect';
import { useDisconnect } from '~/hooks/use-disconnect';
import { cn } from '~/utils/cn';

const PowerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    className={'size-7 stroke-primary stroke-2'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
    />
  </svg>
);

interface ConnectButtonProps {
  address?: string;
}
export const ConnectButton = ({ address }: ConnectButtonProps) => {
  const {
    mutate: connect,
    isPending: isPendingConnect,
    isSuccess: isSuccessConnect,
  } = useConnect();
  const {
    mutate: disconect,
    isPending: isPendingDisconnect,
    isSuccess: isSuccessDisconnect,
  } = useDisconnect();

  const isAnon = !address;

  // Mutations are almost instantaneous, but address is not as fast
  const isLoadingConnect = isPendingConnect || (isSuccessConnect && !address);
  const isLoadingDisconnect =
    isPendingDisconnect || (isSuccessDisconnect && !!address);

  const isLoading = isLoadingConnect || isLoadingDisconnect;

  const onClick = () => {
    isAnon ? connect() : disconect();
  };

  const tooltipText = isAnon
    ? 'Connect Wallet to Interact'
    : 'Disconnect Wallet';

  return (
    <data className="tooltip tooltip-bottom" data-tip={tooltipText}>
      <button
        disabled={isLoading}
        className={cn('btn btn-square btn-neutral rounded-lg', {
          'hover:btn-error [&>*]:hover:stroke-white': !isAnon,
        })}
        onClick={onClick}
      >
        {isLoading ? (
          <span className="loading loading-spinner text-white/20" />
        ) : (
          <PowerIcon />
        )}
      </button>
    </data>
  );
};
