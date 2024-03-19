import { ComponentPropsWithRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import StartNewConversation from '@/components/message/StartNewConversation';
import Conversations from '@/components/message/Conversations';
import { MessageRoute, useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import NoEnableXmtp from '@/components/message/NoEnableXmtp';
import useConversationList from '@/hooks/message/xmtp/useConversationList';

export default function MessageMenu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const { xmtpClient, messageRouteParams, setMessageRouteParams } =
    useXmtpClient();
  const { peerAddress } = messageRouteParams;
  const { isLoading, conversationList } = useConversationList();
  useEffect(() => {
    if (isLoading) return;
    if (conversationList.length === 0) return;
    if (peerAddress) return;
    setMessageRouteParams({
      route: MessageRoute.HOME,
      peerAddress: conversationList[0]?.conversation?.peerAddress,
    });
  }, [isLoading, conversationList, peerAddress]);

  return (
    <div
      className={cn(`w-[280px] h-full flex flex-col bg-[#1B1E23]`, className)}
      {...props}
    >
      <div className="flex-1 w-full p-[20px] box-border overflow-auto">
        <h1 className="text-[#FFF] text-[24px] font-medium leading-[20px] mb-[20px]">
          Message
        </h1>
        <div className="flex-1 w-full flex flex-col gap-[5px]">
          {(() => {
            if (!xmtpClient) {
              return <NoEnableXmtp />;
            }
            return (
              <>
                {' '}
                <StartNewConversation />
                <Conversations className="flex-1 overflow-auto" />
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
