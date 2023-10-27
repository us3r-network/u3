/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:29:11
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 18:28:48
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useAuthentication } from '@us3r-network/auth-with-rainbowkit';
import { ButtonPrimary } from '../common/button/ButtonBase';
import WalletSvg from '../common/assets/svgs/wallet.svg';
import useLogin from '../../hooks/shared/useLogin';
import Loading from '../common/loading/Loading';

function NoLogin({ ...wrapperProps }: StyledComponentPropsWithRef<'div'>) {
  const { login } = useLogin();
  const { ready, status } = useAuthentication();
  return (
    <NoLoginWrapper {...wrapperProps}>
      <NoLoginContainer>
        {(() => {
          if (!ready) {
            return <Loading />;
          }
          if (status === 'loading') {
            return <MainText>Authorizing ...</MainText>;
          }

          if (status === 'unauthenticated') {
            return (
              <>
                <Icon src={WalletSvg} />
                <MainText>No Wallet Connected</MainText>
                <SecondaryText>
                  Get Started by connecting your wallet
                </SecondaryText>
                <LoginButton onClick={() => login()}>
                  Connect Wallet
                </LoginButton>
              </>
            );
          }
          return <Loading />;
        })()}
      </NoLoginContainer>
    </NoLoginWrapper>
  );
}
export default NoLogin;
export const NoLoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
`;
const NoLoginContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: #1b1e23;
  border-radius: 20px;
`;
const Icon = styled.img`
  width: 100px;
  height: 100px;
`;
const MainText = styled.span`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
`;
const SecondaryText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #718096;
`;
const LoginButton = styled(ButtonPrimary)`
  width: 228px;
`;
