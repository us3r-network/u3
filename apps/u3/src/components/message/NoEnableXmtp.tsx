import styled from 'styled-components';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ButtonPrimary } from '../common/button/ButtonBase';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import MessageModalCloseBtn from './MessageModalCloseBtn';

export default function NoEnableXmtp() {
  const { openConnectModal } = useConnectModal();
  const { xmtpClient, enablingXmtp } = useXmtpClient();
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
                <Description>You do not have message enabled yet.</Description>
                <LoginButton
                  disabled={enablingXmtp}
                  onClick={() => openConnectModal && openConnectModal()}
                >
                  {enablingXmtp ? 'Applying ...' : 'Apply'}
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

const LoginButton = styled(ButtonPrimary)`
  width: 240px;
`;
