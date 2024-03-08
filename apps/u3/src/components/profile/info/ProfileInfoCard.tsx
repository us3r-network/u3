import { Profile as U3Profile } from '@us3r-network/data-model';
import { ComponentPropsWithRef, useMemo } from 'react';
import useDid from '@/hooks/profile/useDid';
// import Loading from '../../common/loading/Loading';
import { MultiPlatformShareMenuBtn } from '@/components/shared/share/MultiPlatformShareMenuBtn';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import { getProfileShareUrl } from '@/utils/shared/share';
import ProfileInfoCardLayout from './ProfileInfoCardLayout';
import useHasU3ProfileWithDid from '@/hooks/profile/useHasU3ProfileWithDid';

interface ProfileInfoCardProps extends ComponentPropsWithRef<'div'> {
  isSelf?: boolean;
  identity: string;
  canNavigateToProfile?: boolean;
  onNavigateToProfileAfter?: () => void;
}
export default function ProfileInfoCard({
  identity,
  isSelf,
  canNavigateToProfile,
  onNavigateToProfileAfter,
  ...wrapperProps
}: ProfileInfoCardProps) {
  const { did, loading: didLoading } = useDid(identity);
  const { u3Profile, hasU3ProfileLoading } = useHasU3ProfileWithDid(did);

  const shareLink = useMemo(() => getProfileShareUrl(identity), [identity]);
  const navigateToProfileUrl = useMemo(
    () => (canNavigateToProfile ? `/u/${identity}` : undefined),
    [canNavigateToProfile, identity]
  );
  if (didLoading || hasU3ProfileLoading) {
    return null;
    // return (
    //   <LoadingWrapper {...wrapperProps}>
    //     <Loading />
    //   </LoadingWrapper>
    // );
  }
  if (did && u3Profile) {
    return (
      <U3ProfileInfoCardContainer
        isSelf={isSelf}
        did={did}
        u3Profile={u3Profile}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
        shareLink={shareLink}
        {...wrapperProps}
      />
    );
  }
  if (identity) {
    return (
      <PlatformProfileInfoCardContainer
        isSelf={isSelf}
        identity={identity}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
        shareLink={shareLink}
        {...wrapperProps}
      />
    );
  }
  return null;
}

interface PlatformProfileInfoCardContainerProps
  extends ComponentPropsWithRef<'div'> {
  identity: string;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  isSelf: boolean;
  shareLink: string;
}
function PlatformProfileInfoCardContainer({
  identity,
  isSelf,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  shareLink,
  ...wrapperProps
}: PlatformProfileInfoCardContainerProps) {
  const {
    fid,
    lensProfiles,
    recommendAddress,
    platformAccounts,
    postCount,
    followerCount,
    followingCount,
    bioLinkLoading,
  } = usePlatformProfileInfoData({ identity });
  return (
    <div className="relative border-b">
      <ProfileInfoCardLayout
        identity={identity}
        isSelf={isSelf}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
        loading={bioLinkLoading}
        address={recommendAddress}
        platformAccounts={platformAccounts}
        postCount={postCount}
        followerCount={followerCount}
        followingCount={followingCount}
        lensProfiles={lensProfiles}
        fid={Number(fid)}
        {...wrapperProps}
      />
      {platformAccounts.length > 0 && (
        <div className="absolute top-6 right-6">
          <MultiPlatformShareMenuBtn
            shareLink={shareLink}
            shareLinkDefaultText={
              isSelf
                ? MY_PROFILE_SHARE_TITLE
                : getShareNewFriendProfileTitle(
                    platformAccounts?.[0]?.name ||
                      platformAccounts?.[0]?.handle ||
                      recommendAddress
                  )
            }
            shareLinkEmbedTitle={'Profile'}
            popoverConfig={{ placement: 'bottom end', offset: 0 }}
          />
        </div>
      )}
    </div>
  );
}

interface U3ProfileInfoCardContainerProps extends ComponentPropsWithRef<'div'> {
  did: string;
  u3Profile: U3Profile;
  isSelf?: boolean;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  shareLink: string;
}
function U3ProfileInfoCardContainer({
  did,
  u3Profile,
  isSelf,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  shareLink,
  ...wrapperProps
}: U3ProfileInfoCardContainerProps) {
  const {
    fid,
    address,
    lensProfiles,
    platformAccounts,
    postCount,
    followerCount,
    followingCount,
    bioLinkLoading,
  } = useU3ProfileInfoData({ did, isSelf: !!isSelf });

  return (
    <div className="relative">
      <ProfileInfoCardLayout
        isSelf={isSelf}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
        loading={bioLinkLoading}
        u3Profile={u3Profile}
        address={address}
        platformAccounts={platformAccounts}
        postCount={postCount}
        followerCount={followerCount}
        followingCount={followingCount}
        lensProfiles={lensProfiles}
        fid={Number(fid)}
        {...wrapperProps}
      />{' '}
      {platformAccounts.length > 0 && (
        <div className="absolute top-6 right-6">
          <MultiPlatformShareMenuBtn
            shareLink={shareLink}
            shareLinkDefaultText={getShareNewFriendProfileTitle(
              u3Profile?.name && !u3Profile?.name?.startsWith('0x')
                ? u3Profile?.name
                : platformAccounts?.[0]?.name ||
                    platformAccounts?.[0]?.handle ||
                    address
            )}
            shareLinkEmbedTitle={'Profile'}
            popoverConfig={{ placement: 'bottom end', offset: 0 }}
          />
        </div>
      )}
    </div>
  );
}

const MY_PROFILE_SHARE_TITLE = 'View my profile in U3!';
const getShareNewFriendProfileTitle = (name) => `New friend ${name} in U3!`;
