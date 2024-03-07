import { useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import ProfileInfoCard from '@/components/profile/info/ProfileInfoCard';
import MessageList from '@/components/message/MessageList';
import SendMessageForm from '@/components/message/SendMessageForm';

export default function MessageDetail() {
  const { messageRouteParams } = useXmtpClient();
  const { peerAddress } = messageRouteParams;
  return (
    <div className="w-full h-full flex">
      <div className="flex-1 h-full px-[20px] pb-[20px] box-border flex flex-col">
        <div className="w-full h-[0] flex-[1] overflow-y-scroll">
          <MessageList />
        </div>
        <SendMessageForm />
      </div>
      {peerAddress && (
        <div className="w-[320px] h-full bg-[#1B1E23] max-sm:hidden">
          <ProfileInfoCard identity={peerAddress} />
        </div>
      )}
    </div>
  );
}
