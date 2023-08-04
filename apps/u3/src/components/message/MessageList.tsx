import styled from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import { useXmtpClient } from '../../contexts/XmtpClientContext';
import { useXmtpStore } from '../../contexts/XmtpStoreContext';
import { getAttachmentUrl, isAttachment, shortAddress } from '../../utils/xmtp';

export default function MessageList() {
  const { xmtpClient } = useXmtpClient();
  const { loadingConversations, convoMessages, currentConvoAddress } =
    useXmtpStore();

  const messages = convoMessages.get(currentConvoAddress) || [];

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
      {(() => {
        if (isAttachment(msg)) {
          const url = getAttachmentUrl(msg);
          return <Image src={url} />;
        }
        return <Message>{msg.content}</Message>;
      })()}

      <MessageTime>{dayjs(msg.sent).format()}</MessageTime>
    </MessageCardWrap>
  );
}

const MessageCardWrap = styled.div<{ isMe: boolean }>`
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
  padding: 10px;
  border-bottom: 1px solid #666;
`;

const UserName = styled.span`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const Message = styled.span`
  font-weight: bold;
  color: #fff;
  font-size: 16px;
`;
const MessageTime = styled.span`
  font-size: 12px;
  color: #666;
  line-height: 1.5;
`;

const Image = styled.img`
  max-width: 50%;
`;
