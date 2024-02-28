import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useNav } from '../../contexts/NavCtx';
import { SocialButtonPrimary } from '../social/button/SocialButton';
import { FollowType } from '@/container/profile/Contacts';

export default function NoConversations() {
  const navigate = useNavigate();
  const { setOpenMessageModal } = useNav();
  return (
    <Wrapper>
      <NoConvosImg src="/message/imgs/no-convos.png" />
      <Description>There is nothing here.</Description>
      <Description>Send a message to your friend?</Description>
      <SocialButtonPrimary
        onClick={() => {
          setOpenMessageModal(false);
          navigate(`/u/contacts?type=${FollowType.FOLLOWERS}`);
        }}
      >
        Find from my following/follower list
      </SocialButtonPrimary>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  padding-top: 20px;
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
