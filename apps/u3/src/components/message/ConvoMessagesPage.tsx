import styled from 'styled-components';
import SendMessageForm from './SendMessageForm';
import MessageList from './MessageList';

export default function ConvoMessagesPage() {
  return (
    <Wrapper>
      <Main>
        <MessageList />
      </Main>
      <SendMessageForm />
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
const Main = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  overflow-y: auto;
`;
