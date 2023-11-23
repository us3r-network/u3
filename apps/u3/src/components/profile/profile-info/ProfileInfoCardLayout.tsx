import { UserInfo } from '@us3r-network/profile';
import styled, { StyledComponentPropsWithRef, css } from 'styled-components';
import { Profile } from '@lens-protocol/react-web';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import PlatformAccounts, { PlatformAccountsData } from './PlatformAccounts';
import Loading from '../../common/loading/Loading';
import PlatformFollowCounts from './PlatformFollowCounts';
import ProfileBtns from './ProfileBtns';
import {
  PlatformProfileBasicInfo,
  U3ProfileBasicInfo,
} from './ProfileBasicInfo';
import { shortPubKey } from '../../../utils/shared/shortPubKey';
import { getDefaultAvatarWithIdentity } from '../../../utils/profile/avatar';
import { SocialPlatform } from '../../../services/social/types';
import { MultiPlatformShareMenuBtn } from '../../shared/share/MultiPlatformShareMenuBtn';

const MY_PROFILE_SHARE_TITLE = 'View my profile in U3!';
const getShareNewFriendProfileTitle = (name) => `New friend ${name} in U3!`;

interface ProfileInfoCardLayoutProps
  extends StyledComponentPropsWithRef<'div'> {
  isU3Profile: boolean;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  did?: string;
  address: string;
  platformAccounts: PlatformAccountsData;
  followersCount: number;
  followingCount: number;
  lensProfiles: Profile[];
  fid?: number;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
  loading?: boolean;
  isSelf: boolean;
  shareLink: string;
}
export default function ProfileInfoCardLayout({
  isU3Profile,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  did,
  address,
  platformAccounts,
  followersCount,
  followingCount,
  lensProfiles,
  fid,
  clickFollowing,
  clickFollowers,
  loading,
  isSelf,
  shareLink,
  ...wrapperProps
}: ProfileInfoCardLayoutProps) {
  const session = useSession();

  const findLensAccount = platformAccounts?.find(
    (item) => item.platform === SocialPlatform.Lens
  );
  const findFarcasterAccount = platformAccounts?.find(
    (item) => item.platform === SocialPlatform.Farcaster
  );
  const showFollowBtn = !!findLensAccount || !!findFarcasterAccount;
  const showMessageBtn = !!address;

  if (loading) {
    return (
      <LoadingWrapper {...wrapperProps}>
        <Loading />
      </LoadingWrapper>
    );
  }

  if (isU3Profile) {
    return (
      <U3ProfileCardWrapper
        did={did}
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...wrapperProps}
      >
        {({ isLoginUser, info }) => {
          return (
            <>
              <HeaderWrapper>
                <U3ProfileBasicInfo
                  did={did}
                  navigateToProfileUrl={navigateToProfileUrl}
                  onNavigateToProfileAfter={onNavigateToProfileAfter}
                />
                <PostShareMenuBtn
                  shareLink={shareLink}
                  shareLinkDefaultText={
                    isLoginUser
                      ? MY_PROFILE_SHARE_TITLE
                      : getShareNewFriendProfileTitle(
                          info?.name || platformAccounts?.[0]?.name || address
                        )
                  }
                  shareLinkEmbedTitle={'Profile'}
                  popoverConfig={{ placement: 'bottom end', offset: 0 }}
                />
              </HeaderWrapper>

              <PlatformAccounts
                isSelf={isSelf}
                data={platformAccounts}
                isLoginUser={isLoginUser}
              />

              <UserInfo.Bio />

              <PlatformFollowCounts
                followersCount={followersCount}
                followingCount={followingCount}
                clickFollowers={clickFollowers}
                clickFollowing={clickFollowing}
              />

              {session?.id && !isLoginUser && (
                <ProfileBtns
                  showFollowBtn={showFollowBtn}
                  showMessageBtn={showMessageBtn}
                  lensProfiles={lensProfiles}
                  fid={fid}
                  address={address}
                />
              )}
            </>
          );
        }}
      </U3ProfileCardWrapper>
    );
  }

  return (
    <PlatformProfileCardWrapper
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...wrapperProps}
    >
      <HeaderWrapper>
        <PlatformProfileBasicInfo
          data={{
            avatar:
              platformAccounts?.[0]?.avatar ||
              getDefaultAvatarWithIdentity(
                address || String(platformAccounts?.[0]?.id) || ''
              ),
            name: platformAccounts?.[0]?.name || shortPubKey(address),
            address,
            identity: platformAccounts?.[0]?.id,
          }}
          navigateToProfileUrl={navigateToProfileUrl}
          onNavigateToProfileAfter={onNavigateToProfileAfter}
        />
        {platformAccounts.length > 0 && (
          <PostShareMenuBtn
            shareLink={shareLink}
            shareLinkDefaultText={getShareNewFriendProfileTitle(
              platformAccounts?.[0]?.name || address
            )}
            shareLinkEmbedTitle={'Profile'}
            popoverConfig={{ placement: 'bottom end', offset: 0 }}
          />
        )}
      </HeaderWrapper>

      <PlatformAccounts data={platformAccounts} isSelf={isSelf} />

      <PlatformBio>
        {platformAccounts.length > 0
          ? platformAccounts?.[0]?.bio
          : 'There is nothing here'}
      </PlatformBio>

      <PlatformFollowCounts
        followersCount={followersCount}
        followingCount={followingCount}
        clickFollowers={clickFollowers}
        clickFollowing={clickFollowing}
      />

      {session?.id && (
        <ProfileBtns
          showFollowBtn={showFollowBtn}
          showMessageBtn={showMessageBtn}
          lensProfiles={lensProfiles}
          fid={fid}
          address={address}
        />
      )}
    </PlatformProfileCardWrapper>
  );
}
const HeaderWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;
export const PostShareMenuBtn = styled(MultiPlatformShareMenuBtn)`
  border: none;
  padding: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: none;
  &:not(:disabled):hover {
    border: none;
    background-color: #14171a;
  }
  & > svg {
    width: 12px;
    height: 12px;
    cursor: pointer;
    path {
      stroke: #ffffff;
    }
  }
`;
const BaseWrapperCss = css`
  padding: 20px;
  width: 360px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
  border: 1px solid #39424c;
`;
const LoadingWrapper = styled.div`
  ${BaseWrapperCss}
  height: 230px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BioCss = css`
  color: var(--718096, #718096);

  /* Text/Body 16pt · 1rem */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  opacity: 0.8;

  display: block;
  margin-top: 20px;
`;

const U3ProfileCardWrapper = styled(UserInfo)`
  ${BaseWrapperCss}

  [data-state-element='Bio'] {
    ${BioCss}
  }
`;
const PlatformProfileCardWrapper = styled.div`
  ${BaseWrapperCss}
`;
const PlatformBio = styled.span`
  ${BioCss}
`;
