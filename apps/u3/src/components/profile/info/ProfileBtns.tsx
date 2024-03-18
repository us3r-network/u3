import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Profile } from '@lens-protocol/react-web';
import { useEffect } from 'react';
import { SocialButtonPrimary } from '../../social/button/SocialButton';
import { ReactComponent as MessageChatSquareSvg } from '../../common/assets/svgs/message-chat-square.svg';
import useCanMessage from '../../../hooks/message/xmtp/useCanMessage';
import {
  useXmtpClient,
  MessageRoute,
} from '../../../contexts/message/XmtpClientCtx';
import ProfileFollowBtn from './ProfileFollowBtn';

interface ProfileBtnsProps extends StyledComponentPropsWithRef<'div'> {
  showFollowBtn: boolean;
  showMessageBtn: boolean;
  lensProfiles?: Profile[];
  fid?: number;
  address?: string;
}
export default function ProfileBtns({
  showFollowBtn,
  showMessageBtn,
  lensProfiles,
  fid,
  address,
  ...wrapperProps
}: ProfileBtnsProps) {
  const { setCanEnableXmtp, setMessageRouteParams } = useXmtpClient();
  useEffect(() => {
    setCanEnableXmtp(true);
  }, []);
  const { canMessage } = useCanMessage(address);
  return (
    <BtnsWrapper {...wrapperProps}>
      {showFollowBtn && <FollowBtn lensProfiles={lensProfiles} fid={fid} />}

      {showMessageBtn && canMessage && (
        <MessageBtn
          onClick={() => {
            setMessageRouteParams({
              route: MessageRoute.PRIVATE_CHAT,
              peerAddress: address,
            });
          }}
        >
          <MessageChatSquareSvg />
        </MessageBtn>
      )}
    </BtnsWrapper>
  );
}
const BtnsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const FollowBtn = styled(ProfileFollowBtn)`
  flex: 1;
  color: #000;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const MessageBtn = styled(SocialButtonPrimary)`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 10px;
  svg {
    path {
      stroke: #14171a;
    }
  }
`;
