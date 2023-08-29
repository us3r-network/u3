import styled from 'styled-components'
import ChatRoomIcon from '../common/icons/ChatRoomIcon'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'

export default function MessageMenu() {
  const { setOpenMessageModal } = useXmtpStore()
  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation()
        setOpenMessageModal((open) => !open)
      }}
    >
      <ChatRoomIcon className="nav-icon" />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #2b2c31;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  > .nav-icon {
    width: 20px;
    height: 20px;
  }
`
