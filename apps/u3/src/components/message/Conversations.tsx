import { DecodedMessage } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import {
  getAttachmentUrl,
  isAttachment,
  truncate,
} from '../../utils/message/xmtp';
import useConversationList from '../../hooks/message/xmtp/useConversationList';
import {
  useXmtpClient,
  MessageRoute,
} from '../../contexts/message/XmtpClientCtx';
import Loading from '../common/loading/Loading';
import NoConversations from './NoConversations';
import { cn } from '@/lib/utils';
import ProfileInfoHeadless from '../profile/info/ProfileInfoHeadless';

export default function Conversations({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const { setMessageRouteParams } = useXmtpClient();
  const { isLoading, conversationList } = useConversationList();

  return (
    <div className={cn('w-full', className)} {...props}>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : conversationList.length > 0 ? (
        <div className="flex flex-col">
          {conversationList.map(({ conversation, latestMessage }) => (
            <ConversationCard
              key={`Convo_${conversation.peerAddress}`}
              selectConvoAction={(address) => {
                setMessageRouteParams({
                  route: MessageRoute.PRIVATE_CHAT,
                  peerAddress: address,
                });
              }}
              address={conversation.peerAddress}
              latestMessage={latestMessage}
            />
          ))}
        </div>
      ) : (
        <NoConversations />
      )}
    </div>
  );
}

function ConversationCard({
  selectConvoAction,
  address,
  latestMessage,
}: {
  selectConvoAction: (address: string) => void;
  address: string;
  latestMessage: DecodedMessage | null;
}) {
  const { xmtpClient } = useXmtpClient();
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  useEffect(() => {
    (async () => {
      if (latestMessage && isAttachment(latestMessage)) {
        const url = await getAttachmentUrl(latestMessage, xmtpClient);
        setAttachmentUrl(url);
      }
    })();
  }, [latestMessage, xmtpClient]);
  return (
    <div
      className="px-0 py-[12px] flex gap-[10px] items-start cursor-pointer text-[#fff]"
      onClick={() => selectConvoAction(address)}
    >
      <ProfileInfoHeadless identity={address} isSelf={false}>
        {({ displayAvatar, displayName }) => {
          return (
            <>
              <img
                src={displayAvatar}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="w-[0] flex-[1] flex flex-col gap-[5px]">
                {/* <Name address={address} /> */}
                <span className="text-[#FFF] text-[16px] font-medium">
                  {displayName}
                </span>
                <div className="text-[#9c9c9c] text-[12px] font-normal line-clamp-1">
                  {latestMessage &&
                    (() => {
                      if (isAttachment(latestMessage)) {
                        return attachmentUrl;
                      }
                      return truncate(latestMessage.content, 75);
                    })()}
                </div>
              </div>
              <span className="text-[#9c9c9c] text-[12px] font-normal">
                {latestMessage && dayjs(latestMessage.sent).fromNow()}
              </span>
            </>
          );
        }}
      </ProfileInfoHeadless>
    </div>
  );
}
