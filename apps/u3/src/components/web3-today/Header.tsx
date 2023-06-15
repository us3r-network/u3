import styled from 'styled-components';
import { LoginButton, UserAvatar, UserName } from '@us3r-network/profile';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import CardBase from '../common/card/CardBase';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import { ReactComponent as BookmarkSvg } from '../common/icons/svgs/bookmark.svg';

export default function Header() {
  const navigate = useNavigate();
  const session = useSession();
  return (
    <Wrapper>
      <Avatar />
      <Title>
        Welcome to Web 3 Today
        <UserName>
          {({ username, isLoading }) =>
            !isLoading && username ? username : null
          }
        </UserName>
        {session && (
          <>
            , <UserName /> !
          </>
        )}
      </Title>
      {!session && <LoginButton>Login</LoginButton>}
      <RightBox>
        <BookmarkButton
          onClick={() => {
            navigate('/favorite');
          }}
        >
          <BookmarkSvg />
        </BookmarkButton>
      </RightBox>
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  height: 100px;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Avatar = styled(UserAvatar)`
  width: 60px;
  height: 60px;
`;

const Title = styled.span`
  &,
  & > * {
    display: inline-block;
    font-size: 28px;
    color: #fff;
  }
`;
const RightBox = styled.div`
  margin-left: auto;
  display: flex;
  gap: 20px;
  align-items: center;
`;
const BookmarkButton = styled(ButtonPrimaryLine)`
  width: 60px;
  height: 60px;
  padding: 0px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0px;
  svg {
    width: 30px;
    height: 30px;
    path {
      stroke: #718096;
    }
  }
`;
const BookmarkNumber = styled.span`
  font-size: 14px;
`;
