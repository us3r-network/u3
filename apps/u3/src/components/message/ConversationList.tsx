import styled from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import { useXmtpConversations } from '../../contexts/XmtpConversationsContext';
import { getLatestMessage, shortAddress, truncate } from '../../utils/xmtp';

export default function ConversationList() {
  const {
    loadingConversations,
    convoMessages,
    selectedConvoAddress,
    setSelectedConvoAddress,
  } = useXmtpConversations();

  const sortedConvos = new Map(
    [...convoMessages.entries()].sort((convoA, convoB) => {
      return getLatestMessage(convoA[1])?.sent <
        getLatestMessage(convoB[1])?.sent
        ? 1
        : -1;
    })
  );

  return (
    <ConversationListWrap>
      {loadingConversations ? (
        <p>Loading...</p>
      ) : (
        Array.from(sortedConvos.keys()).map((address) => {
          const messages = sortedConvos.get(address);
          return (
            <ConversationCard
              key={`Convo_${address}`}
              isSelected={selectedConvoAddress === address}
              setSelectedConvo={setSelectedConvoAddress}
              address={address}
              latestMessage={getLatestMessage(messages)}
            />
          );
        })
      )}
    </ConversationListWrap>
  );
}
const ConversationListWrap = styled.div`
  width: 100%;
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
        {latestMessage && truncate(latestMessage.content, 75)}
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
  background-color: ${(props) => (props.isSelected ? '#ddd' : '#fff')};
  &:hover {
    background-color: #ddd;
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
