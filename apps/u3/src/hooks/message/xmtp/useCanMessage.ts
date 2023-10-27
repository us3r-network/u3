import { useEffect, useState } from 'react';
import { useXmtpClient } from '../../../contexts/message/XmtpClientCtx';

export default function useCanMessage(peerAddress: string) {
  const { xmtpClient } = useXmtpClient();
  const [canMessage, setCanMessage] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  useEffect(() => {
    (async () => {
      setIsChecking(true);
      if (!xmtpClient || !peerAddress) {
        setCanMessage(false);
        return;
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
