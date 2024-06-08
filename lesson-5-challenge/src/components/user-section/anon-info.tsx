import { Info } from './info';

const ANON_IMG_SRC = 'https://api.dicebear.com/8.x/identicon/svg?seed=ANON';
const ANON_NAME = 'ANON';
const ANON_INFO = 'Browsing as guest';

interface Props {
  connectButton: React.ReactNode;
}

export const AnonInfo = ({ connectButton }: Props) => {
  return (
    <Info
      imageSrc={ANON_IMG_SRC}
      name={ANON_NAME}
      info={<span className="text-xs text-white/60">{ANON_INFO}</span>}
      connectButton={connectButton}
    />
  );
};
