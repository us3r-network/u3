import { Profile as U3Profile } from '@us3r-network/data-model';
import { useProfileState } from '@us3r-network/profile';
import { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';
import useDid from '@/hooks/profile/useDid';
// import Loading from '../../common/loading/Loading';
import { MultiPlatformShareMenuBtn } from '@/components/shared/share/MultiPlatformShareMenuBtn';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import { isDidPkh } from '@/utils/shared/did';
import { getProfileShareUrl } from '@/utils/shared/share';
import ProfileInfoCardLayout from './ProfileInfoCardLayout';

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
  const { getProfileWithDid } = useProfileState();
  const [u3Profile, setU3Profile] = useState(null);
  const [hasProfileLoading, setHasProfileLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (isDidPkh(did)) {
        setHasProfileLoading(true);
        const profile = await getProfileWithDid(did);
        if (profile) {
          setU3Profile(profile);
        }
        setHasProfileLoading(false);
      } else {
        setU3Profile(null);
      }
    })();
  }, [did]);

  const shareLink = useMemo(() => getProfileShareUrl(identity), [identity]);
  const navigateToProfileUrl = useMemo(
    () => (canNavigateToProfile ? `/u/${identity}` : undefined),
    [canNavigateToProfile, identity]
  );
  if (didLoading || hasProfileLoading) {
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
    postsCount,
    followersCount,
    followingCount,
    bioLinkLoading,
  } = usePlatformProfileInfoData({ identity });
  return (
    <div className="relative">
      <ProfileInfoCardLayout
        identity={identity}
        isSelf={isSelf}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
        loading={bioLinkLoading}
        address={recommendAddress}
        platformAccounts={platformAccounts}
        postsCount={postsCount}
        followersCount={followersCount}
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
    postsCount,
    followersCount,
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
        postsCount={postsCount}
        followersCount={followersCount}
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
