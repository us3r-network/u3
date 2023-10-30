import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Profile, useActiveProfile, useFollow } from '@lens-protocol/react-web';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { SocialButtonPrimary } from '../../social/button/SocialButton';
import useFarcasterFollowAction from '../../../hooks/social/farcaster/useFarcasterFollowAction';
import {
  MessageRoute,
  useXmtpStore,
} from '../../../contexts/message/XmtpStoreCtx';
import { useNav } from '../../../contexts/NavCtx';
import { ReactComponent as MessageChatSquareSvg } from '../../common/assets/svgs/message-chat-square.svg';
import useCanMessage from '../../../hooks/message/xmtp/useCanMessage';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';

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
  const { following: farcasterFollowings } = useFarcasterCtx();
  const lensProfileFirst = lensProfiles?.[0];
  const { data: activeProfile } = useActiveProfile();

  const { execute: lensFollow, isPending: lensFollowIsPending } = useFollow({
    followee: lensProfileFirst || ({ id: '' } as Profile),
    follower: activeProfile,
  });

  const { followAction: fcastFollow, isPending: fcastFollowIsPending } =
    useFarcasterFollowAction();

  const fcastIsFollowing = useMemo(
    () => farcasterFollowings.includes(String(fid)),
    [fid, farcasterFollowings]
  );

  const onFollow = useCallback(async () => {
    if (
      !lensFollowIsPending &&
      lensProfileFirst &&
      !lensProfileFirst.isFollowedByMe &&
      lensProfileFirst?.followStatus?.canFollow
    ) {
      try {
        await lensFollow();
        toast.success('Lens follow success!');
      } catch (error) {
        toast.error(error.message);
      }
    }

    if (fid && !fcastFollowIsPending && !fcastIsFollowing) {
      fcastFollow(fid);
    }
  }, [
    lensProfileFirst,
    lensFollow,
    lensFollowIsPending,
    fid,
    fcastFollow,
    fcastFollowIsPending,
    fcastIsFollowing,
  ]);

  const isFollowing =
    (lensProfileFirst?.isFollowedByMe && fcastIsFollowing) ||
    (fid && fcastIsFollowing && !lensProfileFirst) ||
    (lensProfileFirst && lensProfileFirst?.isFollowedByMe && !fid);

  const followActionDisabled =
    lensFollowIsPending || fcastFollowIsPending || isFollowing;

  const { setMessageRouteParams } = useXmtpStore();
  const { setOpenMessageModal } = useNav();
  const { canMessage } = useCanMessage(address);
  return (
    <BtnsWrapper {...wrapperProps}>
      {showFollowBtn && (
        <FollowBtn onClick={onFollow} disabled={followActionDisabled}>
          {isFollowing ? 'Following' : 'follow'}
        </FollowBtn>
      )}

      {showMessageBtn && canMessage && (
        <MessageBtn
          onClick={() => {
            setOpenMessageModal(true);
            setMessageRouteParams({
              route: MessageRoute.DETAIL,
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
  margin-top: 30px;
`;

const FollowBtn = styled(SocialButtonPrimary)`
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
