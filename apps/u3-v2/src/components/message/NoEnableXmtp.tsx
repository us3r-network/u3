import styled from 'styled-components'
import { ButtonPrimary } from '../common/button/ButtonBase'
import { useXmtpClient } from '../../contexts/xmtp/XmtpClientCtx'
import { useConnectModal } from '@rainbow-me/rainbowkit'

function NoEnableXmtp() {
  const { openConnectModal } = useConnectModal()
  const { xmtpClient, enablingXmtp } = useXmtpClient()
  return (
    <NoEnableXmtpWrapper>
      <NoEnableXmtpContainer>
        {(() => {
          if (enablingXmtp) {
            return (
              <>
                <MainText>Enabling Xmtp ...</MainText>
              </>
            )
          }

          if (!xmtpClient) {
            return (
              <>
                <MainText>No Enable Xmtp</MainText>
                <LoginButton
                  onClick={() => openConnectModal && openConnectModal()}
                >
                  Enable Xmtp
                </LoginButton>
              </>
            )
          }
          return <MainText>Enabled Xmtp</MainText>
        })()}
      </NoEnableXmtpContainer>
    </NoEnableXmtpWrapper>
  )
}
export default NoEnableXmtp
export const NoEnableXmtpWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
`
const NoEnableXmtpContainer = styled.div`
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
const LoginButton = styled(ButtonPrimary)`
  width: 228px;
`
