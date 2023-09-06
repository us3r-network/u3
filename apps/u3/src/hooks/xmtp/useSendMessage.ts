import { useCallback, useState } from 'react';
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx';

type SendMessageAction = (
  message: string,
  opts?: {
    onSuccess?: () => void;
    onFail?: (error: Error) => void;
  }
) => Promise<void>;

export default function useSendMessage(peerAddress: string) {
  const { xmtpClient } = useXmtpClient();
  const [isSending, setIsSending] = useState(false);
  const sendMessage: SendMessageAction = useCallback(
    async (message, opts) => {
      if (!peerAddress) {
        return;
      }
      try {
        if (!xmtpClient) {
          throw new Error('Please connect to an XMTP account');
        }
        setIsSending(true);
        const conversation = await xmtpClient.conversations.newConversation(
          peerAddress
        );
        await conversation.send(message);
        opts?.onSuccess?.();
      } catch (error) {
        opts?.onFail?.(error as Error);
      } finally {
        setIsSending(false);
      }
    },
    [xmtpClient, peerAddress]
  );

  return {
    isSending,
    sendMessage,
  };
}
