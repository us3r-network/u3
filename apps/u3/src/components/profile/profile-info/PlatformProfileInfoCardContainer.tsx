import { StyledComponentPropsWithRef } from 'styled-components';
import ProfileInfoCardLayout from './ProfileInfoCardLayout';
import usePlatformProfileInfoData from '../../../hooks/profile/usePlatformProfileInfoData';

interface PlatformProfileInfoCardContainerProps
  extends StyledComponentPropsWithRef<'div'> {
  identity: string;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
  isSelf: boolean;
  shareLink: string;
}
export default function PlatformProfileInfoCardContainer({
  identity,
  isSelf,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  clickFollowing,
  clickFollowers,
  shareLink,
  ...wrapperProps
}: PlatformProfileInfoCardContainerProps) {
  const {
    fid,
    lensProfiles,
    recommendAddress,
    platformAccounts,
    followersCount,
    followingCount,
    bioLinkLoading,
  } = usePlatformProfileInfoData({ identity });

  return (
    <ProfileInfoCardLayout
      isSelf={isSelf}
      isU3Profile={false}
      navigateToProfileUrl={navigateToProfileUrl}
      onNavigateToProfileAfter={onNavigateToProfileAfter}
      loading={bioLinkLoading}
      address={recommendAddress}
      platformAccounts={platformAccounts}
      followersCount={followersCount}
      followingCount={followingCount}
      lensProfiles={lensProfiles}
      fid={Number(fid)}
      clickFollowing={clickFollowing}
      clickFollowers={clickFollowers}
      shareLink={shareLink}
      {...wrapperProps}
    />
  );
}
