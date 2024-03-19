import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import ColorButton from '../common/button/ColorButton';

export default function NoEnableXmtp() {
  const { isConnected, isConnecting } = useAccount();
  const { xmtpClient, enablingXmtp, enableXmtp } = useXmtpClient();
  return (
    <div className="pt-[42px] w-full flex flex-col gap-[20px] items-center">
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
                  return 'Enable Xmtp';
                })()}
              </Description>
              <ColorButton
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
                  return 'Enable';
                })()}
              </ColorButton>
            </>
          );
        }
        return <Description>Enabled Xmtp</Description>;
      })()}
    </div>
  );
}
const Description = styled.span`
  color: #9c9c9c;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
