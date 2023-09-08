import { useCallback, useState } from 'react';
import { ContentTypeAttachment } from '@xmtp/content-type-remote-attachment';
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx';

type SendAttachmentAction = (
  file: File,
  opts?: {
    onSuccess?: () => void;
    onFail?: (error: Error) => void;
  }
) => Promise<void>;

export default function useSendAttachment(peerAddress: string) {
  const { xmtpClient } = useXmtpClient();
  const [isSending, setIsSending] = useState(false);
  const sendAttachment: SendAttachmentAction = useCallback(
    async (file, opts) => {
      if (!peerAddress) {
        return;
      }
      try {
        if (!xmtpClient) {
          throw new Error('Please connect to an XMTP account');
        }

        if (file.size > 1 * 1024 * 1024) {
          throw new Error('File size must be less than 1MB');
        }

        setIsSending(true);
        const conversation = await xmtpClient.conversations.newConversation(
          peerAddress
        );
        const fileName = file.name;
        const mimeType = file.type;
        const blob = new Blob([file], { type: mimeType });
        const data = new Uint8Array(await blob.arrayBuffer());
        const attachment = {
          filename: fileName,
          mimeType,
          data,
        };
        await conversation.send(attachment, {
          contentType: ContentTypeAttachment,
        });
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
    sendAttachment,
  };
}
