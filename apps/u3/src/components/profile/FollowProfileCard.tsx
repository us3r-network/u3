import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useMemo } from 'react';
import { SocialButtonPrimaryLine } from '../social/button/SocialButton';
import { SocialMessageChatBtn } from '../message/MessageChatBtn';
import { SocialPlatform } from '../../services/social/types';
import LensIcon from '../common/icons/LensIcon';
import FarcasterIcon from '../common/icons/FarcasterIcon';
import useCanMessage from '../../hooks/message/xmtp/useCanMessage';
import { useNav } from '../../contexts/NavCtx';
import {
  useXmtpClient,
  MessageRoute,
} from '../../contexts/message/XmtpClientCtx';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import NavigateToProfileLink from './NavigateToProfileLink';

export type FollowProfileData = {
  handle: string;
  avatar: string;
  name: string;
  address: string;
  bio: string;
  platforms: SocialPlatform[];
  isFollowed: boolean;
};

export type FollowProfileCardProps = StyledComponentPropsWithRef<'div'> & {
  data: FollowProfileData;
  followPending?: boolean;
  unfollowPending?: boolean;
  followAction?: () => void;
  unfollowAction?: () => void;
};

export default function FollowProfileCard({
  data,
  followPending,
  unfollowPending,
  followAction,
  unfollowAction,
  ...wrapperProps
}: FollowProfileCardProps) {
  const { setCanEnableXmtp } = useXmtpClient();
  useEffect(() => {
    setCanEnableXmtp(true);
  }, []);

  const { handle, avatar, name, address, bio, platforms, isFollowed } = data;
  const { canMessage } = useCanMessage(address);
  const { setMessageRouteParams } = useXmtpClient();
  const { setOpenMessageModal } = useNav();

  const profileIdentity = useMemo(() => {
    if (handle.endsWith('.eth')) return handle;
    const firstPlatform = platforms?.[0];
    switch (firstPlatform) {
      case SocialPlatform.Lens:
        return lensHandleToBioLinkHandle(handle);
      case SocialPlatform.Farcaster:
        return farcasterHandleToBioLinkHandle(handle);
      default:
        return '';
    }
  }, [handle, platforms]);

  const profileUrl = useMemo(() => {
    if (profileIdentity) {
      return `/u/${profileIdentity}`;
    }
    return '';
  }, [profileIdentity]);

  return (
    <Wrapper {...wrapperProps}>
      <Top>
        <TopLeft>
          <NavigateToProfileLink href={profileUrl}>
            <Avatar src={avatar} />
          </NavigateToProfileLink>

          <AccountInfo>
            <AccountName>
              <NavigateToProfileLink href={profileUrl}>
                {name || handle}{' '}
              </NavigateToProfileLink>

              {platforms.map((item) => {
                switch (item) {
                  case SocialPlatform.Lens:
                    return <LensIcon width="12px" height="12px" />;
                  case SocialPlatform.Farcaster:
                    return <FarcasterIcon width="12px" height="12px" />;
                  default:
                    return null;
                }
              })}
            </AccountName>
            <AccountAddress>{address}</AccountAddress>
          </AccountInfo>
        </TopLeft>
        <TopRight>
          <FollowBtn
            disabled={followPending || unfollowPending}
            onClick={() => {
              if (isFollowed) {
                unfollowAction?.();
              } else {
                followAction?.();
              }
            }}
          >
            {(() => {
              if (followPending) {
                return 'Following';
              }
              if (unfollowPending) {
                return 'Unfollowing';
              }
              if (isFollowed) {
                return 'Following';
              }
              return 'Follow';
            })()}
          </FollowBtn>
          {canMessage && (
            <SocialMessageChatBtn
              onClick={() => {
                setOpenMessageModal(true);
                setMessageRouteParams({
                  route: MessageRoute.DETAIL,
                  peerAddress: address,
                });
              }}
            />
          )}
        </TopRight>
      </Top>
      {!!bio && <Bio>{bio}</Bio>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 20px;
  box-sizing: border-box;
  background: #1b1e23;
`;
const Top = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;
const TopLeft = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: center;
`;
const TopRight = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AccountName = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  color: #fff;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
const AccountAddress = styled.div`
  color: var(--718096, #718096);
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const FollowBtn = styled(SocialButtonPrimaryLine)`
  width: 80px;
  height: 40px;
`;
const Bio = styled.div`
  margin-top: 12px;
  flex-shrink: 0;

  color: var(--718096, #718096);
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 200% */

  /* opacity: 0.8; */
`;
