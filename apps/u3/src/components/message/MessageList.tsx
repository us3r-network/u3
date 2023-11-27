import styled from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import { useXmtpStore } from '../../contexts/message/XmtpStoreCtx';
import { getAttachmentUrl, isAttachment } from '../../utils/message/xmtp';
import Avatar from './Avatar';
import { useNav } from '../../contexts/NavCtx';

export default function MessageList() {
  const { xmtpClient, messageRouteParams } = useXmtpClient();
  const { loadingConversations, convoMessages } = useXmtpStore();

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
  const navigate = useNavigate();
  const { setOpenMessageModal } = useNav();
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
  const profileUrl = useMemo(
    () => `/u/${msg.senderAddress}`,
    [msg.senderAddress]
  );
  return (
    <MessageRowWrapper>
      <a
        href={profileUrl}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate(profileUrl);
          setOpenMessageModal(false);
        }}
      >
        <AvatarStyled address={msg.senderAddress} />
      </a>

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
