import { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useMemo } from 'react';
import { useProfilesOwnedBy } from '@lens-protocol/react-web';
import { PlatformAccountsData } from './PlatformAccounts';
import { SocailPlatform } from '../../../api';
import { useFarcasterCtx } from '../../../contexts/FarcasterCtx';
import useUpsertFarcasterUserData from '../../../hooks/farcaster/useUpsertFarcasterUserData';
import useFarcasterFollowNum from '../../../hooks/farcaster/useFarcasterFollowNum';
import useBioLinkListWithWeb3Bio from '../../../hooks/profile/useBioLinkListWithWeb3Bio';
import ProfileInfoBaseCard from './ProfileInfoCardLayout';
import getAvatar from '../../../utils/lens/getAvatar';
import useLazyQueryFidWithAddress from '../../../hooks/farcaster/useLazyQueryFidWithAddress';

interface PlatformProfileInfoCardContainerProps
  extends StyledComponentPropsWithRef<'div'> {
  identity: string;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function PlatformProfileInfoCardContainer({
  identity,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: PlatformProfileInfoCardContainerProps) {
  const {
    bioLinkList,
    lensBioLinks,
    fcastBioLinks,
    loading: bioLinkLoading,
  } = useBioLinkListWithWeb3Bio(identity);
  const { farcasterUserData } = useFarcasterCtx();

  const address = bioLinkList.find((item) => !!item.address)?.address;

  const { data: lensProfiles } = useProfilesOwnedBy({
    address: lensBioLinks?.[0]?.address || '',
  });
  const lensProfileFirst = lensProfiles?.[0];

  const { fetch: fetchFid, fid } = useLazyQueryFidWithAddress(
    fcastBioLinks?.[0]?.address || ''
  );
  useEffect(() => {
    fetchFid();
  }, [fcastBioLinks]);

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
        platform: SocailPlatform.Farcaster,
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
          platform: SocailPlatform.Lens,
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
      loading={bioLinkLoading}
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