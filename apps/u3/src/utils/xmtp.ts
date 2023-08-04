import { ContentTypeAttachment } from '@xmtp/content-type-remote-attachment';
import { DecodedMessage } from '@xmtp/xmtp-js';

export const shortAddress = (addr: string) =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;

export const truncate = (str: string, length: number) => {
  if (!str) {
    return str;
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`;
  }
  return str;
};

export const getLatestMessage = (messages: DecodedMessage[]) =>
  messages?.length ? messages[messages.length - 1] : null;

const ENCODING = 'binary';

export const buildLocalStorageKey = (walletAddress: string) =>
  walletAddress ? `xmtp:${'dev'}:keys:${walletAddress}` : '';

export const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

export const wipeKeys = (walletAddress: string) => {
  // This will clear the conversation cache + the private keys
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

/**
 * Attachment
 */
export const isAttachment = (message: DecodedMessage) => {
  return message.contentType.sameAs(ContentTypeAttachment);
};

export const getAttachmentUrl = (message: DecodedMessage) => {
  const blobdecoded = new Blob([message.content.data], {
    type: message.content.mimeType,
  });
  const url = URL.createObjectURL(blobdecoded);
  return url;
};
