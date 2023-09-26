import styled from 'styled-components';
import { MessageRoute, useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx';
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx';
import NoEnableXmtp from './NoEnableXmtp';
import ConversationsPage from './ConversationsPage';
import ConvoMessagesPage from './ConvoMessagesPage';
import { useNav } from '../../contexts/NavCtx';

export default function MessageModal() {
  const { xmtpClient } = useXmtpClient();
  const { messageRouteParams } = useXmtpStore();
  const { openMessageModal } = useNav();
  return (
    <Wrapper open={openMessageModal}>
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
  );
}

const Wrapper = styled.div<{ open: boolean }>`
  z-index: 3;
  width: 400px;
  height: 760px;
  max-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;

  position: absolute;
  bottom: 20px;
  right: -10px;
  transform: translateX(100%);

  display: ${({ open }) => (open ? 'block' : 'none')};
`;
