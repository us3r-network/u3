import styled from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import { useXmtpClient } from '../../contexts/XmtpClientContext';
import { useXmtpConversations } from '../../contexts/XmtpConversationsContext';
import { shortAddress } from '../../utils/xmtp';

export default function MessageList() {
  const { xmtpClient } = useXmtpClient();
  const { loadingConversations, convoMessages, selectedConvoAddress } =
    useXmtpConversations();

  const messages = convoMessages.get(selectedConvoAddress) || [];

  return (
    <MessageListWrap>
      {loadingConversations ? (
        <p>-</p>
      ) : (
        messages.map((msg) => {
          const isMe = xmtpClient?.address === msg.senderAddress;
          return <MessageCard key={msg.id} msg={msg} isMe={isMe} />;
        })
      )}
    </MessageListWrap>
  );
}
const MessageListWrap = styled.div`
  width: 100%;
`;

function MessageCard({ isMe, msg }: { isMe: boolean; msg: DecodedMessage }) {
  return (
    <MessageCardWrap isMe={isMe}>
      <UserName>{isMe ? 'Me' : shortAddress(msg.senderAddress)}</UserName>
      <Message>{msg.content}</Message>
      <MessageTime>{dayjs(msg.sent).format()}</MessageTime>
    </MessageCardWrap>
  );
}

const MessageCardWrap = styled.div<{ isMe: boolean }>`
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => (props.isMe ? '#f0f0f0' : '#fff')};
`;

const UserName = styled.span`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const Message = styled.p`
  font-weight: bold;
  font-size: 16px;
`;
const MessageTime = styled.span`
  font-size: 12px;
  color: #666;
  line-height: 1.5;
`;
