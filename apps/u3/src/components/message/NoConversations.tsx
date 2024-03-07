import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ColorButton from '../common/button/ColorButton';

export default function NoConversations() {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <NoConvosImg src="/message/imgs/no-convos.png" />
      <Description>There is nothing here.</Description>
      <Description>Send a message to your friend?</Description>
      <ColorButton
        onClick={() => {
          navigate(`/u/contacts`);
        }}
      >
        Find from <br />
        my following/follower list
      </ColorButton>
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
