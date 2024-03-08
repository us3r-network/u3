import { useEffect } from 'react';
import { MessageRoute, useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import MessageMenu from './MessageMenu';
import { XmtpStoreProvider } from '@/contexts/message/XmtpStoreCtx';
import MessageDetail from './MessageDetail';

export default function MessageLayout() {
  const { messageRouteParams, setCanEnableXmtp } = useXmtpClient();
  const { route, peerAddress } = messageRouteParams;
  useEffect(() => {
    setCanEnableXmtp(true);
  }, [setCanEnableXmtp]);
  return (
    <XmtpStoreProvider>
      <div className="w-full h-full flex">
        <div className="w-[280px] h-full max-sm:hidden">
          <MessageMenu />
        </div>
        <div className="flex-1 h-full overflow-auto">
          {route === MessageRoute.DETAIL && peerAddress && <MessageDetail />}
        </div>
      </div>
    </XmtpStoreProvider>
  );
}
