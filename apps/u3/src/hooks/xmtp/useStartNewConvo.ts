import { useCallback, useState } from 'react';
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx';

type StartNewConvoAction = (
  convoAddress: string,
  opts?: {
    onSuccess?: () => void;
    onFail?: (error: Error) => void;
  }
) => Promise<void>;

export default function useStartNewConvo() {
  const { xmtpClient } = useXmtpClient();
  const [isStarting, setIsStarting] = useState(false);
  const startNewConvo: StartNewConvoAction = useCallback(
    async (convoAddress, opts) => {
      try {
        if (!xmtpClient) {
          throw new Error('Please connect to an XMTP account');
        }
        setIsStarting(true);
        const isOnNetwork = await xmtpClient.canMessage(convoAddress);
        if (!isOnNetwork) {
          throw new Error(
            "Recipient hasn't created an XMTP identity and can't receive messages"
          );
        }
        const convo = await xmtpClient.conversations.newConversation(
          convoAddress
        );
        await convo.send('hi');
        opts?.onSuccess?.();
      } catch (error) {
        opts?.onFail?.(error as Error);
      } finally {
        setIsStarting(false);
      }
    },
    [xmtpClient]
  );
  return {
    isStarting,
    startNewConvo,
  };
}
