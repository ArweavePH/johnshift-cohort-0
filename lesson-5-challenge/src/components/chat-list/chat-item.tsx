import { AVATAR_PREFIX } from '~/core/constants';
import { Chat } from '~/core/types';
import { base64ToImage } from '~/utils/base64-to-image';
import { cn } from '~/utils/cn';
import { formatAddress } from '~/utils/format-address';
import { prettyTimestamp } from '~/utils/pretty-timestamp';

interface Props {
  owner: Chat['owner'];
  timestamp: Chat['timestamp'];
  message: Chat['message'];
  file: Chat['file'];
  isEnd: boolean;
}

export const ChatItem = ({ owner, timestamp, message, isEnd, file }: Props) => {
  return (
    <div className={cn('chat chat-start', { 'chat-end': isEnd })}>
      <div className="avatar chat-image">
        <div className="w-10 rounded-full">
          <img alt={owner} src={`${AVATAR_PREFIX}${owner}`} />
        </div>
      </div>

      <div className="chat-header flex items-center gap-2 pb-1">
        {formatAddress(owner)}
      </div>

      <div className="chat-bubble space-y-4">
        {message.length > 0 && (
          <span className="whitespace-pre-line">{message}</span>
        )}
        {file && (
          <img
            src={base64ToImage(file.src, file.type)}
            className="max-h-[200px] max-w-[200px] md:max-h-[300px] md:max-w-[300px]"
          />
        )}
      </div>

      <time className="chat-footer pt-1 text-xs opacity-50">
        {prettyTimestamp(timestamp)}
      </time>
    </div>
  );
};
