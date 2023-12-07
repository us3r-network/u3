import styled from 'styled-components';
import { UserAvatar, UserName } from '@us3r-network/profile';
import LogoIcon from '../icons/LogoIcon';
import XCloseIcon from '../icons/XCloseIcon';
import ColorLogoIcon from '../icons/ColorLogoIcon';
import useLogin from '../../../../hooks/shared/useLogin';

export default function Header() {
  const { isLogin } = useLogin();
  return (
    <Wrapper>
      <PrimaryTitle>Caster Daily</PrimaryTitle>
      <Line />
      <RightWrapper>
        <SecondaryTitleWrapper>
          <SecondaryTitle>Today‘s Referrers</SecondaryTitle>
          <UserNameWrapper>
            <LogoIcon />
            {isLogin && (
              <>
                <XCloseIcon />
                <UserNameStyled />
              </>
            )}
          </UserNameWrapper>
        </SecondaryTitleWrapper>
        <RightLogoWrapper>
          <ColorLogoIconStyled />
          {isLogin && <UserAvatarStyled />}
        </RightLogoWrapper>
      </RightWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 40px 0px 20px 0px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
`;
const Line = styled.div`
  width: 1px;
  height: 100px;
  background: #000;
`;
const PrimaryTitle = styled.span`
  color: var(--14171-a, #14171a);
  font-family: Marion;
  font-size: 120px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const SecondaryTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;
const SecondaryTitle = styled.span`
  color: #000;
  font-family: Snell Roundhand;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;
const UserNameStyled = styled(UserName)`
  color: #000;
  font-family: Snell Roundhand;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const RightLogoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;
const ColorLogoIconStyled = styled(ColorLogoIcon)`
  width: 100px;
  height: 100px;

  border-radius: 60px;
`;
const UserAvatarStyled = styled(UserAvatar)`
  width: 100px !important;
  height: 100px !important;

  border-radius: 60px;
  border: 4px solid #f6f6f4;
  box-sizing: border-box;
  margin-left: -40px;
`;
