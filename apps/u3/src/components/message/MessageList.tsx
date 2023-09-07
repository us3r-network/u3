import styled from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx';
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx';
import { getAttachmentUrl, isAttachment } from '../../utils/xmtp';
import Avatar from './Avatar';

export default function MessageList() {
  const { xmtpClient } = useXmtpClient();
  const { loadingConversations, convoMessages, messageRouteParams } =
    useXmtpStore();

  const messages =
    convoMessages.get(messageRouteParams?.peerAddress || '') || [];

  return (
    <MessageListWrap>
      {!loadingConversations &&
        messages.map((msg) => {
          const isMe = xmtpClient?.address === msg.senderAddress;
          if (isMe) {
            return <MyMessageRow key={msg.id} msg={msg} />;
          }
          return <MessageRow key={msg.id} msg={msg} />;
        })}
    </MessageListWrap>
  );
}
const MessageListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function MessageRow({ msg }: { msg: DecodedMessage }) {
  const { xmtpClient } = useXmtpClient();
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  useEffect(() => {
    (async () => {
      if (isAttachment(msg)) {
        const url = await getAttachmentUrl(msg, xmtpClient);
        setAttachmentUrl(url);
      }
    })();
  }, [msg, xmtpClient]);
  return (
    <MessageRowWrapper>
      <AvatarStyled address={msg.senderAddress} />
      <MessageWrapper>
        {(() => {
          if (isAttachment(msg)) {
            return <Image src={attachmentUrl} />;
          }
          return <Text>{msg.content}</Text>;
        })()}
      </MessageWrapper>
    </MessageRowWrapper>
  );
}

function MyMessageRow({ msg }: { msg: DecodedMessage }) {
  const { xmtpClient } = useXmtpClient();
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  useEffect(() => {
    (async () => {
      if (isAttachment(msg)) {
        const url = await getAttachmentUrl(msg, xmtpClient);
        setAttachmentUrl(url);
      }
    })();
  }, [msg, xmtpClient]);
  return (
    <MyMessageRowWrapper>
      <MyMessageWrapper>
        {(() => {
          if (isAttachment(msg)) {
            return <Image src={attachmentUrl} />;
          }
          return <MyText>{msg.content}</MyText>;
        })()}
      </MyMessageWrapper>
      <AvatarStyled address={msg.senderAddress} />
    </MyMessageRowWrapper>
  );
}

const MessageRowWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`;

const AvatarStyled = styled(Avatar)`
  width: 20px;
  height: 20px;
`;
const MessageWrapper = styled.div`
  max-width: calc(100% - (15px + 20px) * 2);
  flex-shrink: 0;
  border-radius: 10px 10px 10px 0px;
  background: #000;
`;
const Text = styled.span`
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  margin: 20px;
`;
const Image = styled.img`
  max-width: 120px;
  object-fit: cover;
  margin: 20px;
`;

const MyMessageRowWrapper = styled(MessageRowWrapper)`
  justify-content: flex-end;
`;
const MyMessageWrapper = styled(MessageWrapper)`
  border-radius: 10px 10px 0px 10px;
  background: #d6f16c;
`;
const MyText = styled(Text)`
  color: #000;
`;