import { ComponentPropsWithRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';
import StartNewConversation from '@/components/message/StartNewConversation';
import Conversations from '@/components/message/Conversations';
import { useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import NoEnableXmtp from '@/components/message/NoEnableXmtp';

export default function MessageMenu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const { pathname } = useLocation();
  const { xmtpClient } = useXmtpClient();
  return (
    <div
      className={cn(
        `
        w-full h-full flex flex-col bg-[#1B1E23]`,
        className
      )}
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
      <LoginButtonV2 />
    </div>
  );
}
