import styled from 'styled-components'
import { MessageRoute, useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import { useRef } from 'react'
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx'
import NoEnableXmtp from './NoEnableXmtp'
import ConversationsPage from './ConversationsPage'
import ConvoMessagesPage from './ConvoMessagesPage'

export default function MessageModal() {
  const { xmtpClient } = useXmtpClient()
  const { openMessageModal, messageRouteParams } = useXmtpStore()
  const modalRef = useRef<HTMLDivElement>(null)

  return (
    <Wrapper open={openMessageModal} ref={modalRef}>
      {(() => {
        if (!xmtpClient) {
          return <NoEnableXmtp />
        }
        if (messageRouteParams.route === MessageRoute.SEARCH) {
          return <ConversationsPage />
        }
        if (messageRouteParams.route === MessageRoute.DETAIL) {
          return <ConvoMessagesPage />
        }
        return null
      })()}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ open: boolean }>`
  width: 400px;
  height: 920px;
  max-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  background: #212228;

  position: absolute;
  top: 80px;
  right: 0;
  transform: translateY(5px);

  display: ${({ open }) => (open ? 'block' : 'none')};
`
