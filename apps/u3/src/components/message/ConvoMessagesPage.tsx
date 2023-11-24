import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import BackIcon from '../common/icons/BackIcon';
import Avatar from './Avatar';
import Name from './Name';
import SendMessageForm from './SendMessageForm';
import MessageList from './MessageList';
import MessageModalCloseBtn from './MessageModalCloseBtn';
import { useNav } from '../../contexts/NavCtx';
import {
  useXmtpClient,
  MessageRoute,
} from '../../contexts/message/XmtpClientCtx';

export default function ConvoMessagesPage() {
  const navigate = useNavigate();
  const { setOpenMessageModal } = useNav();
  const { messageRouteParams, setMessageRouteParams } = useXmtpClient();
  const { peerAddress } = messageRouteParams;
  const profileUrl = useMemo(() => `/u/${peerAddress}`, [peerAddress]);
  return (
    <Wrapper>
      <Header>
        <BackBtn
          onClick={() => {
            setMessageRouteParams({
              route: MessageRoute.SEARCH,
            });
          }}
        />
        <HeaderCenter>
          <a
            href={profileUrl}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(profileUrl);
              setOpenMessageModal(false);
            }}
          >
            <AvatarStyled address={peerAddress || ''} />
          </a>

          <a
            href={profileUrl}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(profileUrl);
              setOpenMessageModal(false);
            }}
          >
            <NameStyled address={peerAddress || ''} />
          </a>
        </HeaderCenter>
        <HeaderRight>
          <MessageModalCloseBtn />
        </HeaderRight>
      </Header>
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
const BackBtn = styled(BackIcon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const HeaderRight = styled.div`
  width: 20px;
  display: flex;
  justify-content: end;
`;
const AvatarStyled = styled(Avatar)`
  width: 20px;
  height: 20px;
`;
const NameStyled = styled(Name)`
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const Main = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  overflow-y: auto;
`;
