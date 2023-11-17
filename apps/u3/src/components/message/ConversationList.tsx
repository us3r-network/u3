import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  MessageRoute,
  useXmtpStore,
} from '../../contexts/message/XmtpStoreCtx';
import {
  getAttachmentUrl,
  isAttachment,
  truncate,
} from '../../utils/message/xmtp';
import useConversationList from '../../hooks/message/xmtp/useConversationList';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import Name from './Name';
import Avatar from './Avatar';
import Loading from '../common/loading/Loading';
import NoConversations from './NoConversations';

export default function ConversationList(
  props: StyledComponentPropsWithRef<'div'>
) {
  const { setMessageRouteParams } = useXmtpStore();

  const { isLoading, conversationList } = useConversationList();

  return (
    <ConversationListWrap {...props}>
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      ) : conversationList.length > 0 ? (
        <CardListWrap>
          {conversationList.map(({ conversation, latestMessage }) => (
            <ConversationCard
              key={`Convo_${conversation.peerAddress}`}
              selectConvoAction={(address) => {
                setMessageRouteParams({
                  route: MessageRoute.DETAIL,
                  peerAddress: address,
                });
              }}
              address={conversation.peerAddress}
              latestMessage={latestMessage}
            />
          ))}
        </CardListWrap>
      ) : (
        <NoConversations />
      )}
    </ConversationListWrap>
  );
}
const ConversationListWrap = styled.div`
  width: 100%;
  min-height: 100%;
`;
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardListWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
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
    <ConversationCardWrap onClick={() => selectConvoAction(address)}>
      <Avatar address={address} />
      <Center>
        <Name address={address} />
        <LatestMessage>
          {latestMessage &&
            (() => {
              if (isAttachment(latestMessage)) {
                return attachmentUrl;
              }
              return truncate(latestMessage.content, 75);
            })()}
        </LatestMessage>
      </Center>
      <LatestMessageTime>
        {latestMessage && dayjs(latestMessage.sent).fromNow()}
      </LatestMessageTime>
    </ConversationCardWrap>
  );
}

const ConversationCardWrap = styled.div`
  padding: 12px 0px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  cursor: pointer;
  color: #fff;
`;
const Center = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LatestMessage = styled.div`
  color: #9c9c9c;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LatestMessageTime = styled.span`
  color: #9c9c9c;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
