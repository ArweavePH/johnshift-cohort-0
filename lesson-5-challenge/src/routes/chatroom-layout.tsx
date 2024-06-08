import { ChatList } from '~/components/chat-list';
import { ChatListNav } from '~/components/chat-list-nav';
import { SendChatForm } from '~/components/chat-list/send-chat-form';

export const ChatroomLayout = () => {
  return (
    <div className="flex h-screen max-h-screen w-full flex-col">
      <ChatListNav />

      <div className="flex relative grow flex-col items-center overflow-y-scroll">
        <ChatList />
      </div>

      <div className="flex justify-center">
        <SendChatForm />
      </div>
    </div>
  );
};
