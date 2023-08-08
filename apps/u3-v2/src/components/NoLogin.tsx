import styled from 'styled-components'
import { useAuthentication } from '@us3r-network/auth-with-rainbowkit'
import { ButtonPrimary } from './common/button/ButtonBase'
import WalletIcon from './common/icons/WalletIcon'

function NoLogin() {
  const { ready, status, signIn } = useAuthentication()
  return (
    <NoLoginWrapper>
      <NoLoginContainer>
        {(() => {
          if (!ready) {
            return <MainText>Initializing Session ...</MainText>
          }
          if (status === 'loading') {
            return <MainText>Authorizing ...</MainText>
          }

          if (status === 'unauthenticated') {
            return (
              <>
                <WalletIcon />
                <MainText>No Wallet Connected</MainText>
                <SecondaryText>
                  Get Started by connecting your wallet
                </SecondaryText>
                <LoginButton onClick={() => signIn()}>
                  Connect Wallet
                </LoginButton>
              </>
            )
          }
          return <MainText>Authenticated</MainText>
        })()}
      </NoLoginContainer>
    </NoLoginWrapper>
  )
}
export default NoLogin
export const NoLoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
`
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
`
const MainText = styled.span`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
`
const SecondaryText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #718096;
`
const LoginButton = styled(ButtonPrimary)`
  width: 228px;
`
