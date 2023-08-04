import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import { useXmtpStore } from '../../contexts/XmtpStoreContext';
import {
  getAttachmentUrl,
  isAttachment,
  shortAddress,
  truncate,
} from '../../utils/xmtp';
import useConversationList from '../../hooks/xmtp/useConversationList';
import Loading from '../common/loading/Loading';

export default function ConversationList(
  props: StyledComponentPropsWithRef<'div'>
) {
  const { currentConvoAddress, setCurrentConvoAddress } = useXmtpStore();

  const { isLoading, conversationList } = useConversationList();

  return (
    <ConversationListWrap {...props}>
      {isLoading ? (
        <Loading />
      ) : (
        <CardListWrap>
          {conversationList.map(({ conversation, latestMessage }) => (
            <ConversationCard
              key={`Convo_${conversation.peerAddress}`}
              isSelected={currentConvoAddress === conversation.peerAddress}
              setSelectedConvo={setCurrentConvoAddress}
              address={conversation.peerAddress}
              latestMessage={latestMessage}
            />
          ))}
        </CardListWrap>
      )}
    </ConversationListWrap>
  );
}
const ConversationListWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CardListWrap = styled.div`
  width: 100%;
  min-height: 100%;
`;
function ConversationCard({
  isSelected,
  setSelectedConvo,
  address,
  latestMessage,
}: {
  isSelected: boolean;
  setSelectedConvo: (address: string) => void;
  address: string;
  latestMessage: DecodedMessage | null;
}) {
  return (
    <ConversationCardWrap
      isSelected={isSelected}
      onClick={() => setSelectedConvo(address)}
    >
      <UserName>{shortAddress(address)}</UserName>
      <LatestMessage>
        {latestMessage &&
          (() => {
            if (isAttachment(latestMessage)) {
              return getAttachmentUrl(latestMessage);
            }
            return truncate(latestMessage.content, 75);
          })()}
        <LatestMessageTime>
          {latestMessage && dayjs(latestMessage.sent).fromNow()}
        </LatestMessageTime>
      </LatestMessage>
    </ConversationCardWrap>
  );
}

const ConversationCardWrap = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #666;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(0, 0, 0, 0.5)' : 'none'};
  color: #fff;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const UserName = styled.p`
  font-weight: bold;
  font-size: 16px;
`;

const LatestMessage = styled.p`
  font-size: 12px;
  color: #666;
`;

const LatestMessageTime = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 10px;
`;
