import styled from 'styled-components';
import ConversationList from '../components/message/ConversationList';
import MessageList from '../components/message/MessageList';
import SendMessageForm from '../components/message/SendMessageForm';
import { useXmtpStore } from '../contexts/XmtpStoreContext';
import StartNewConversation from '../components/message/StartNewConversation';
import { useXmtpClient } from '../contexts/XmtpClientContext';
import NoEnableXmtp from '../components/message/NoEnableXmtp';
import { MainWrapper } from '../components/layout/Index';

export default function Message() {
  const { xmtpClient } = useXmtpClient();
  const { currentConvoAddress, conversations } = useXmtpStore();
  if (!xmtpClient) {
    return <NoEnableXmtp />;
  }
  return (
    <MessageWrap>
      <ConvosWrap>
        <Header>
          <Title>Chat List ({conversations.size})</Title>
          <StartNewConversation />
        </Header>
        <ConversationList className="convo-list" />
      </ConvosWrap>
      <MsgWrap>
        {currentConvoAddress && (
          <>
            <MsgListWrap>
              <MessageList />
            </MsgListWrap>
            <SendMessageForm />
          </>
        )}
      </MsgWrap>
    </MessageWrap>
  );
}
const MessageWrap = styled(MainWrapper)`
  display: flex;
`;
const Header = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #666;
`;
const Title = styled.h1`
  color: #fff;
`;
const ConvosWrap = styled.div`
  width: 350px;
  height: 100%;
  border-right: 1px solid #666;
  display: flex;
  flex-direction: column;
  .convo-list {
    height: 0;
    flex: 1;
    overflow-y: auto;
  }
`;
const MsgWrap = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const MsgListWrap = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  overflow: auto;
  padding: 10px;
`;
