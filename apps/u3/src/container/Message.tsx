import styled from 'styled-components';
import ConversationList from '../components/message/ConversationList';
import MessageList from '../components/message/MessageList';
import SendMessageForm from '../components/message/SendMessageForm';
import { useXmtpConversations } from '../contexts/XmtpConversationsContext';
import StartNewConversation from '../components/message/StartNewConversation';
import { useXmtpClient } from '../contexts/XmtpClientContext';

export default function Message() {
  const { xmtpClient, enableXmtp, enablingXmtp } = useXmtpClient();
  const { selectedConvoAddress, conversations } = useXmtpConversations();
  return (
    <MessageWrap>
      <MainWrap>
        <ConvosWrap>
          {(() => {
            if (enablingXmtp) {
              return <p>Enabling...</p>;
            }
            if (!xmtpClient) {
              return (
                <button
                  type="button"
                  onClick={() => {
                    enableXmtp(null);
                  }}
                >
                  Enable Xmtp
                </button>
              );
            }
            return (
              <>
                <h1>Chat List({conversations.size})</h1>
                <hr />
                <StartNewConversation />
                <hr />
                <ConversationList />
              </>
            );
          })()}
        </ConvosWrap>
        <MsgWrap>
          {selectedConvoAddress && (
            <>
              <MsgListWrap>
                <MessageList />
              </MsgListWrap>
              <SendMessageForm />
            </>
          )}
        </MsgWrap>
      </MainWrap>
    </MessageWrap>
  );
}
const MessageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const MainWrap = styled.div`
  height: 0;
  flex: 1;
  display: flex;
`;
const ConvosWrap = styled.div`
  width: 300px;
  height: 100%;
  background-color: #f0f0f0;
  overflow: auto;
  border-right: 1px solid #ddd;
`;
const MsgWrap = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
  background-color: #fff;

  display: flex;
  flex-direction: column;
`;
const MsgListWrap = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  overflow: auto;
`;
