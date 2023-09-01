import styled from 'styled-components'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import ConversationList from './ConversationList'
import NoConversations from './NoConversations'
import SearchConversation from './SearchConversation'

export default function ConversationsPage() {
  const { conversations } = useXmtpStore()
  return (
    <Wrapper>
      <Title>Message</Title>
      <SearchConversation />
      {conversations.size === 0 ? <NoConversations /> : <Conversations />}
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
const Title = styled.h1`
  margin: 0;
  padding: 0;
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
const Conversations = styled(ConversationList)`
  height: 0;
  flex: 1;
  overflow-y: auto;
`
