import { cn } from '~/utils/cn';

interface InfoProps {
  imageSrc: string;
  name: React.ReactNode;
  info: React.ReactNode;
  isPending?: boolean;
  connectButton: React.ReactNode;
}

export const Info = ({
  imageSrc,
  name,
  info,
  isPending,
  connectButton,
}: InfoProps) => {
  return (
    <div className="flex h-16 w-full items-center justify-between bg-neutral px-4 text-white">
      <div
        className={cn('flex w-full items-center gap-4 text-white', {
          'pointer-events-none opacity-70': isPending,
        })}
      >
        <div className="avatar">
          <div className="w-10 rounded-full ring ring-slate-600 ring-offset-2 ring-offset-base-100">
            <img src={imageSrc} />
          </div>
        </div>
        <div className="flex flex-col items-start">
          {typeof name === 'string' ? (
            <span className="text-lg font-bold">{name}</span>
          ) : (
            name
          )}

          {typeof info === 'string' ? (
            <span className="text-sm text-white/60">Browsing as guest</span>
          ) : (
            info
          )}
        </div>
      </div>
      {connectButton}
    </div>
  );
};
