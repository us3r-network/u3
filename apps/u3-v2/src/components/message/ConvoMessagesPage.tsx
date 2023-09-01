import styled from 'styled-components'
import { MessageRoute, useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import BackIcon from '../common/icons/BackIcon'
import Avatar from './Avatar'
import Name from './Name'
import SendMessageForm from './SendMessageForm'
import MessageList from './MessageList'

export default function ConvoMessagesPage() {
  const { messageRouteParams, setMessageRouteParams } = useXmtpStore()
  return (
    <Wrapper>
      <Header>
        <BackBtn
          onClick={() => {
            setMessageRouteParams({
              route: MessageRoute.SEARCH,
            })
          }}
        />
        <HeaderCenter>
          <AvatarStyled address={messageRouteParams.peerAddress || ''} />
          <NameStyled address={messageRouteParams.peerAddress || ''} />
        </HeaderCenter>
        <HeaderRight></HeaderRight>
      </Header>
      <Main>
        <MessageList />
      </Main>
      <SendMessageForm />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const BackBtn = styled(BackIcon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const Header = styled.div`
  display: flex;
  align-items: center;
`
const HeaderCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
const HeaderRight = styled.div`
  width: 20px;
`
const AvatarStyled = styled(Avatar)`
  width: 20px;
  height: 20px;
`
const NameStyled = styled(Name)`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
const Main = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  overflow-y: auto;
`
