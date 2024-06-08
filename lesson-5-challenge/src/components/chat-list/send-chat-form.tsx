import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { uid } from 'uid';

import { Chat } from '~/core/types';
import { useSendChat } from '~/hooks/use-send-chat';
import { useUserAddress } from '~/hooks/use-user-address';
import { cn } from '~/utils/cn';

const FILE_SIZE_LIMIT = 100_000;

export const SendChatForm = () => {
  const { roomId } = useParams();
  const { data: address } = useUserAddress();

  const [message, setMessage] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<Chat['file'] | null>(null);
  const [isPendingImage, setIsPendingImage] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log({ file });
      if (file.size > FILE_SIZE_LIMIT) {
        toast.error('File size is too large. Max size is 100KB.');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setIsPendingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          setSelectedFile({ src: base64String, type: file.type });
        }
        setIsPendingImage(false);
      };

      reader.onerror = () => {
        toast.error('Something went wrong while reading the file.');
        setSelectedFile(null);
        setIsPendingImage(false);
      };
    }
  };

  const { mutate, isPending } = useSendChat();
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (address && roomId) {
      mutate(
        {
          id: uid(),
          roomId,
          owner: address,
          message,
          timestamp: Date.now(),
          file: selectedFile,
        },
        {
          onError(error, variables, context) {
            console.error({ error, variables, context });
          },
          onSuccess: () => {
            setMessage('');
          },
        },
      );
    }
  };

  const isLoading = isPending || !address || isPendingImage;

  return (
    <form
      className="flex size-full max-w-2xl flex-col items-center justify-center gap-2 py-2"
      onSubmit={onSubmit}
    >
      <textarea
        rows={2}
        name="message"
        disabled={isLoading}
        className="textarea textarea-bordered w-full resize-none"
        placeholder="What's on your mind?"
        value={message}
        onChange={onChange}
      />
      <div className="flex w-full items-center justify-between">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={cn('file-input file-input-sm w-full max-w-xs', {
            'opacity-60': isLoading,
          })}
          disabled={isLoading}
          onChange={handleFileChange}
        />
        <button
          disabled={isLoading || (!message && !selectedFile)}
          className="btn btn-neutral btn-sm"
        >
          Send
        </button>
      </div>
    </form>
  );
};
