import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment'
import { Client, DecodedMessage } from '@xmtp/xmtp-js'
import { XMTP_ENV } from '../constants/xmtp'

export const shortAddress = (addr: string) =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr

export const truncate = (str: string, length: number) => {
  if (!str) {
    return str
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`
  }
  return str
}

export const getLatestMessage = (messages: DecodedMessage[]) =>
  messages?.length ? messages[messages.length - 1] : null

const ENCODING = 'binary'

export const buildLocalStorageKey = (walletAddress: string) =>
  walletAddress ? `xmtp:${XMTP_ENV}:keys:${walletAddress}` : ''

export const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress))
  return val ? Buffer.from(val, ENCODING) : null
}

export const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING),
  )
}

export const wipeKeys = (walletAddress: string) => {
  // This will clear the conversation cache + the private keys
  localStorage.removeItem(buildLocalStorageKey(walletAddress))
}

/**
 * Attachment
 */
export const isXmtpAttachment = (message: DecodedMessage) => {
  return message.contentType.sameAs(ContentTypeAttachment)
}

export const isRemoteAttachment = (message: DecodedMessage) => {
  return message.contentType.sameAs(ContentTypeRemoteAttachment)
}

export const isAttachment = (message: DecodedMessage) => {
  return isXmtpAttachment(message) || isRemoteAttachment(message)
}

export const getXmtpAttachmentUrl = (message: DecodedMessage) => {
  const blobdecoded = new Blob([message.content.data], {
    type: message.content.mimeType,
  })
  const url = URL.createObjectURL(blobdecoded)
  return url
}
export const getRemoteAttachmentUrl = async (
  message: DecodedMessage,
  client: Client,
) => {
  const attachment: any = await RemoteAttachmentCodec.load(
    message.content,
    client,
  )

  const blobdecoded = new Blob([Buffer.from(attachment.data)], {
    type: attachment.mimeType,
  })
  const url = URL.createObjectURL(blobdecoded)
  return url
}

export const getAttachmentUrl = async (
  message: DecodedMessage,
  client?: Client | null,
) => {
  if (isXmtpAttachment(message)) {
    return getXmtpAttachmentUrl(message)
  }
  if (isRemoteAttachment(message) && client) {
    return getRemoteAttachmentUrl(message, client)
  }
  return ''
}
