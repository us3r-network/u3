import { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useMemo } from 'react';
import { useProfilesOwnedBy } from '@lens-protocol/react-web';
import { PlatformAccountsData } from './PlatformAccounts';
import { SocialPlatform } from '../../../services/social/types';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import useUpsertFarcasterUserData from '../../../hooks/social/farcaster/useUpsertFarcasterUserData';
import useFarcasterFollowNum from '../../../hooks/social/farcaster/useFarcasterFollowNum';
import useBioLinkListWithWeb3Bio from '../../../hooks/profile/useBioLinkListWithWeb3Bio';
import ProfileInfoBaseCard from './ProfileInfoCardLayout';
import getAvatar from '../../../utils/social/lens/getAvatar';
import useLazyQueryFidWithAddress from '../../../hooks/social/farcaster/useLazyQueryFidWithAddress';

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
    lensBioLinks,
    fcastBioLinks,
    recommendAddress,
    loading: bioLinkLoading,
  } = useBioLinkListWithWeb3Bio(identity);
  const { farcasterUserData } = useFarcasterCtx();

  const { data: lensProfiles } = useProfilesOwnedBy({
    address: lensBioLinks?.[0]?.address || recommendAddress,
  });
  const lensProfileFirst = lensProfiles?.[0];

  const { fetch: fetchFid, fid } = useLazyQueryFidWithAddress(
    fcastBioLinks?.[0]?.address || recommendAddress
  );
  useEffect(() => {
    fetchFid();
  }, [fetchFid]);

  const { upsertFarcasterUserData } = useUpsertFarcasterUserData();
  useEffect(() => {
    if (fid && !farcasterUserData[fid]) {
      upsertFarcasterUserData({ fid });
    }
  }, [fid, farcasterUserData]);

  const { farcasterFollowData } = useFarcasterFollowNum(fid);

  const platformAccounts: PlatformAccountsData = useMemo(() => {
    const accounts = [];
    for (const fcastProfile of fcastBioLinks) {
      accounts.push({
        platform: SocialPlatform.Farcaster,
        avatar: fcastProfile.avatar,
        name: fcastProfile.displayName,
        handle: fcastProfile.identity,
        id: fid,
        bio: fcastProfile.description,
        address: fcastProfile.address,
      });
    }
    if (lensProfiles?.length > 0) {
      for (const lensProfile of lensProfiles) {
        accounts.push({
          platform: SocialPlatform.Lens,
          avatar: getAvatar(lensProfile),
          name: lensProfile.name,
          handle: lensProfile.handle,
          id: lensProfile.id,
          bio: lensProfile.bio,
          address: lensProfile.ownedBy,
        });
      }
    }
    return accounts;
  }, [lensProfiles, fcastBioLinks, fid]);

  const followersCount = useMemo(() => {
    const lensFollowersCount = lensProfileFirst?.stats.totalFollowers || 0;

    return lensFollowersCount + farcasterFollowData.followers;
  }, [lensProfileFirst, farcasterFollowData]);

  const followingCount = useMemo(() => {
    const lensFollowersCount = lensProfileFirst?.stats.totalFollowing || 0;

    return lensFollowersCount + farcasterFollowData.following;
  }, [lensProfileFirst, farcasterFollowData]);

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
