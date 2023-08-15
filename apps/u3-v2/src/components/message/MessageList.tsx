import styled from 'styled-components'
import { DecodedMessage } from '@xmtp/xmtp-js'
import dayjs from 'dayjs'
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import { getAttachmentUrl, isAttachment, shortAddress } from '../../utils/xmtp'
import { useEffect, useState } from 'react'

export default function MessageList() {
  const { xmtpClient } = useXmtpClient()
  const { loadingConversations, convoMessages, currentConvoAddress } =
    useXmtpStore()

  const messages = convoMessages.get(currentConvoAddress) || []

  return (
    <MessageListWrap>
      {loadingConversations ? (
        <p>-</p>
      ) : (
        messages.map((msg) => {
          const isMe = xmtpClient?.address === msg.senderAddress
          return <MessageCard key={msg.id} msg={msg} isMe={isMe} />
        })
      )}
    </MessageListWrap>
  )
}
const MessageListWrap = styled.div`
  width: 100%;
`

function MessageCard({ isMe, msg }: { isMe: boolean; msg: DecodedMessage }) {
  const { xmtpClient } = useXmtpClient()
  const [attachmentUrl, setAttachmentUrl] = useState<string>('')
  useEffect(() => {
    ;(async () => {
      if (isAttachment(msg)) {
        const url = await getAttachmentUrl(msg, xmtpClient)
        setAttachmentUrl(url)
      }
    })()
  }, [msg, xmtpClient])
  return (
    <MessageCardWrap isMe={isMe}>
      <UserName>{isMe ? 'Me' : shortAddress(msg.senderAddress)}</UserName>
      {(() => {
        if (isAttachment(msg)) {
          return <Image src={attachmentUrl} />
        }
        return <Message>{msg.content}</Message>
      })()}

      <MessageTime>{dayjs(msg.sent).format()}</MessageTime>
    </MessageCardWrap>
  )
}

const MessageCardWrap = styled.div<{ isMe: boolean }>`
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
  padding: 10px;
  border-bottom: 1px solid #666;
`

const UserName = styled.span`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`

const Message = styled.span`
  font-weight: bold;
  color: #000;
  font-size: 16px;
`
const MessageTime = styled.span`
  font-size: 12px;
  color: #666;
  line-height: 1.5;
`

const Image = styled.img`
  max-width: 50%;
`
