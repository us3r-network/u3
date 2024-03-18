import styled from 'styled-components';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import { useXmtpStore } from '../../contexts/message/XmtpStoreCtx';
import { getAttachmentUrl, isAttachment } from '../../utils/message/xmtp';
import ProfileInfoHeadless from '../profile/info/ProfileInfoHeadless';

export default function MessageList() {
  const { xmtpClient, messageRouteParams } = useXmtpClient();
  const { loadingConversations, convoMessages } = useXmtpStore();

  const messages =
    convoMessages.get(messageRouteParams?.peerAddress || '') || [];

  const messageListEndRef = useRef<HTMLDivElement>(null);
  const megLen = messages.length;
  useEffect(() => {
    (async () => {
      await new Promise((r) => {
        setTimeout(r, 100);
      });
      messageListEndRef?.current?.scrollIntoView({
        behavior: 'smooth',
      });
    })();
  }, [megLen]);
  return (
    <div className="w-full flex flex-col gap-[20px] py-[20px]">
      {!loadingConversations &&
        messages.map((msg) => {
          const isMe = xmtpClient?.address === msg.senderAddress;
          if (isMe) {
            return <MyMessageRow key={msg.id} msg={msg} />;
          }
          return <MessageRow key={msg.id} msg={msg} />;
        })}
      <div id="message-list-end" ref={messageListEndRef} />
    </div>
  );
}

function MessageRow({ msg }: { msg: DecodedMessage }) {
  const navigate = useNavigate();
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
      <ProfileInfoHeadless identity={msg.senderAddress}>
        {({ displayAvatar }) => {
          return (
            <a
              href={profileUrl}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate(profileUrl);
              }}
            >
              <img
                src={displayAvatar}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
            </a>
          );
        }}
      </ProfileInfoHeadless>

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
    </MyMessageRowWrapper>
  );
}

const MessageRowWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
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
