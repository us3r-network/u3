import styled from 'styled-components';
import {
  useXmtpClient,
  MessageRoute,
} from '../../contexts/message/XmtpClientCtx';
import NoEnableXmtp from './NoEnableXmtp';
import ConversationsPage from './ConversationsPage';
import ConvoMessagesPage from './ConvoMessagesPage';
import { XmtpStoreProvider } from '../../contexts/message/XmtpStoreCtx';

export default function MessageModalBody() {
  const { xmtpClient, messageRouteParams } = useXmtpClient();
  return (
    <XmtpStoreProvider>
      <Wrapper>
        {(() => {
          if (!xmtpClient) {
            return <NoEnableXmtp />;
          }
          if (messageRouteParams.route === MessageRoute.SEARCH) {
            return <ConversationsPage />;
          }
          if (messageRouteParams.route === MessageRoute.DETAIL) {
            return <ConvoMessagesPage />;
          }
          return null;
        })()}
      </Wrapper>
    </XmtpStoreProvider>
  );
}

const Wrapper = styled.div`
  width: 400px;
  height: 760px;
  max-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;

  margin-left: 10px;
`;
