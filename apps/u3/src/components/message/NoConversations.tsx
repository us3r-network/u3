import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx';
import { ButtonPrimary } from '../common/button/ButtonBase';

export default function NoConversations() {
  const navigate = useNavigate();
  const { setOpenMessageModal } = useXmtpStore();
  return (
    <Wrapper>
      <NoConvosImg src="/message/imgs/no-convos.png" />
      <Description>There is nothing here.</Description>
      <Description>Send a message to your friend?</Description>
      <ButtonPrimary
        disabled
        onClick={() => {
          setOpenMessageModal(false);
          navigate('/');
        }}
      >
        find from my following/ follower list (Comming soon)
      </ButtonPrimary>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  padding-top: 42px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;
const NoConvosImg = styled.img`
  width: 200px;
  height: 200px;
`;
const Description = styled.span`
  color: #9c9c9c;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
