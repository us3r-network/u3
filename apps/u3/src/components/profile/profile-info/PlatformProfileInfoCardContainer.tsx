import { StyledComponentPropsWithRef } from 'styled-components';
import ProfileInfoBaseCard from './ProfileInfoCardLayout';
import usePlatformProfileInfoData from '../../../hooks/profile/usePlatformProfileInfoData';

interface PlatformProfileInfoCardContainerProps
  extends StyledComponentPropsWithRef<'div'> {
  identity: string;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function PlatformProfileInfoCardContainer({
  identity,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  clickFollowing,
  clickFollowers,
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
    <ProfileInfoBaseCard
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
      {...wrapperProps}
    />
  );
}
