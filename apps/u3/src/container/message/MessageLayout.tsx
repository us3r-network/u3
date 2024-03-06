import { useEffect } from 'react';
import { useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import MessageMenu from './MessageMenu';
import ConvoMessagesPage from '@/components/message/ConvoMessagesPage';
import ProfileInfoCard from '@/components/profile/info/ProfileInfoCard';
import { XmtpStoreProvider } from '@/contexts/message/XmtpStoreCtx';

export default function ProfileLayout() {
  const { messageRouteParams, setCanEnableXmtp } = useXmtpClient();
  const { peerAddress } = messageRouteParams;
  useEffect(() => {
    setCanEnableXmtp(true);
  }, [setCanEnableXmtp]);
  return (
    <XmtpStoreProvider>
      <div className="w-full h-full flex">
        <div className="w-[280px] h-full max-sm:hidden">
          <MessageMenu />
        </div>
        {peerAddress && (
          <>
            {' '}
            <div className="flex-1 h-full overflow-auto">
              <ConvoMessagesPage />
            </div>
            <div className="w-[320px] h-full max-sm:hidden">
              <ProfileInfoCard identity={peerAddress} />
            </div>
          </>
        )}
      </div>
    </XmtpStoreProvider>
  );
}
