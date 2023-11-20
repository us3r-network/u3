import styled from 'styled-components';
import ConversationList from './ConversationList';
// import SearchConversation from './SearchConversation';
import MessageModalCloseBtn from './MessageModalCloseBtn';
import StartNewConversation from './StartNewConversation';

export default function ConversationsPage() {
  return (
    <Wrapper>
      <Header>
        <Title>Message</Title>
        <MessageModalCloseBtn />
      </Header>
      {/* <SearchConversation /> */}
      <StartNewConversation />
      <Conversations />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h1`
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const Conversations = styled(ConversationList)`
  height: 0;
  flex: 1;
  overflow-y: auto;
`;
