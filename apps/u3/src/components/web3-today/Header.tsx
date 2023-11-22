/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-30 14:41:21
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-22 15:15:13
 * @FilePath: /u3/apps/u3/src/components/web3-today/Header.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { LoginButton, UserAvatar, UserName } from '@us3r-network/profile';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import CardBase from '../common/card/CardBase';
import {
  ButtonPrimaryLine,
  ButtonPrimaryLineCss,
} from '../common/button/ButtonBase';
import { ReactComponent as BookmarkSvg } from '../common/assets/svgs/bookmark.svg';

export default function Header() {
  const navigate = useNavigate();
  const session = useSession();
  return (
    <Wrapper>
      <Avatar />
      <Title>Welcome to Web 3 Today !</Title>
      {!session && <LoginButtonStyled>Login</LoginButtonStyled>}
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

const LoginButtonStyled = styled(LoginButton)`
  ${ButtonPrimaryLineCss}
`;
