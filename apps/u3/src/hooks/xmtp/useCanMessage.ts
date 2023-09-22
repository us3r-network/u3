import { useEffect, useState } from 'react';
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx';

export default function useCanMessage(peerAddress: string) {
  const { xmtpClient } = useXmtpClient();
  const [canMessage, setCanMessage] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  useEffect(() => {
    (async () => {
      setIsChecking(true);
      if (!xmtpClient) {
        setCanMessage(false);
      }
      try {
        const isOnNetwork = await xmtpClient.canMessage(peerAddress);
        setCanMessage(isOnNetwork);
      } catch (error) {
        setCanMessage(false);
      } finally {
        setIsChecking(false);
      }
    })();
  }, [xmtpClient, peerAddress]);
  return {
    canMessage,
    isChecking,
  };
}
