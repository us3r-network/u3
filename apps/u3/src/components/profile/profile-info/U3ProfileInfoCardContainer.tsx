import { StyledComponentPropsWithRef } from 'styled-components';
import ProfileInfoCardLayout from './ProfileInfoCardLayout';
import useU3ProfileInfoData from '../../../hooks/profile/useU3ProfileInfoData';

interface U3ProfileInfoCardContainerProps
  extends StyledComponentPropsWithRef<'div'> {
  did: string;
  isSelf?: boolean;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function U3ProfileInfoCardContainer({
  did,
  isSelf,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: U3ProfileInfoCardContainerProps) {
  const {
    fid,
    address,
    lensProfiles,
    platformAccounts,
    followersCount,
    followingCount,
    bioLinkLoading,
  } = useU3ProfileInfoData({ did, isSelf: !!isSelf });

  return (
    <ProfileInfoCardLayout
      isSelf={isSelf}
      isU3Profile
      navigateToProfileUrl={navigateToProfileUrl}
      onNavigateToProfileAfter={onNavigateToProfileAfter}
      loading={bioLinkLoading}
      did={did}
      address={address}
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
