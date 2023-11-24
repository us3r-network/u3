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
    </XmtpStoreProvider>
  );
}
