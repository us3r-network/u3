import { useEffect } from 'react';
import { MessageRoute, useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import MessageMenu from './MessageMenu';
import { XmtpStoreProvider } from '@/contexts/message/XmtpStoreCtx';
import MessageDetail from './MessageDetail';
import { cn } from '@/lib/utils';
import MessageMobileHeader from './MessageMobileHeader';
import Conversations from '@/components/message/Conversations';
import NoEnableXmtp from '@/components/message/NoEnableXmtp';
import StartNewConversation from '@/components/message/StartNewConversation';

export default function MessageLayout() {
  const { messageRouteParams, setCanEnableXmtp, xmtpClient } = useXmtpClient();
  const { route, peerAddress } = messageRouteParams;
  useEffect(() => {
    setCanEnableXmtp(true);
  }, [setCanEnableXmtp]);
  return (
    <XmtpStoreProvider>
      <div className={cn('w-full h-full flex', 'max-sm:flex-col')}>
        <div className="w-[280px] h-full max-sm:hidden ">
          <MessageMenu />
        </div>

        <MessageMobileHeader />
        <div className="flex-1 h-full overflow-auto max-sm:hidden">
          {peerAddress && <MessageDetail />}
        </div>
        <div className="flex-1 h-full overflow-auto hidden max-sm:block ">
          {(() => {
            if (!xmtpClient) {
              return <NoEnableXmtp />;
            }
            return (
              <>
                {route === MessageRoute.HOME && (
                  <div className="w-full h-full flex flex-col gap-[10px] p-[10px] box-border">
                    <StartNewConversation />
                    <Conversations className="flex-1 overflow-auto" />
                  </div>
                )}
                {route === MessageRoute.PRIVATE_CHAT && peerAddress && (
                  <MessageDetail />
                )}
              </>
            );
          })()}
        </div>
      </div>
    </XmtpStoreProvider>
  );
}
