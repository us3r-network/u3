import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import MessageModalCloseBtn from './MessageModalCloseBtn';
import { SocialButtonPrimary } from '../social/button/SocialButton';

export default function NoEnableXmtp() {
  const { isConnected, isConnecting } = useAccount();
  const { xmtpClient, enablingXmtp, enableXmtp } = useXmtpClient();
  return (
    <>
      <Header>
        <MessageModalCloseBtn />
      </Header>
      <Wrapper>
        {(() => {
          if (!xmtpClient) {
            return (
              <>
                <Description>
                  {(() => {
                    if (enablingXmtp) {
                      return 'Enabling your XMTP identity...';
                    }
                    if (isConnecting) {
                      return 'Connecting Wallet...';
                    }
                    if (!isConnected) {
                      return 'Connect Your Wallet';
                    }
                    return '';
                  })()}
                </Description>
                <LoginButton
                  disabled={isConnecting || enablingXmtp}
                  onClick={() => enableXmtp()}
                >
                  {(() => {
                    if (enablingXmtp) {
                      return 'Enabling...';
                    }
                    if (isConnecting) {
                      return 'Connecting...';
                    }
                    if (!isConnected) {
                      return 'Connect';
                    }
                    return '';
                  })()}
                </LoginButton>
              </>
            );
          }
          return <Description>Enabled Xmtp</Description>;
        })()}
      </Wrapper>
    </>
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
const Header = styled.div`
  display: flex;
  justify-content: end;
`;
const Description = styled.span`
  color: #9c9c9c;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const LoginButton = styled(SocialButtonPrimary)`
  width: 240px;
`;
