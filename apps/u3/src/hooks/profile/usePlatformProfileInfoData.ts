import { useEffect, useMemo } from 'react';
import { useProfiles } from '@lens-protocol/react-web';
import useBioLinkListWithWeb3Bio from './useBioLinkListWithWeb3Bio';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import useUpsertFarcasterUserData from '../social/farcaster/useUpsertFarcasterUserData';
import useFarcasterUserStats from '../social/farcaster/useFarcasterUserStats';
import { PlatformAccountData, SocialPlatform } from '@/services/social/types';
import getAvatar from '@/utils/social/lens/getAvatar';
import {
  getBio,
  getHandle,
  getName,
  getOwnedByAddress,
} from '@/utils/social/lens/profile';
import useFetchFidWithFname from '../social/farcaster/useFetchFidWithFname';

export default function usePlatformProfileInfoData({
  identity,
}: {
  identity: string;
}) {
  const {
    lensBioLinks,
    fcastBioLinks,
    recommendAddress,
    loading: bioLinkLoading,
  } = useBioLinkListWithWeb3Bio(identity);
  const { farcasterUserData } = useFarcasterCtx();

  const { data: lensProfiles, loading: lensProfilesLoading } = useProfiles({
    where: {
      ownedBy: [lensBioLinks?.[0]?.address || recommendAddress],
    },
  });
  const lensProfileFirst = lensProfiles?.[0];

  const fname = fcastBioLinks?.[0]?.identity;
  const { fid, fetchFid, loading: fidLoading } = useFetchFidWithFname();

  useEffect(() => {
    if (fname) {
      fetchFid(fname);
    }
  }, [fetchFid, fname]);

  const { upsertFarcasterUserData } = useUpsertFarcasterUserData();
  useEffect(() => {
    if (fid && !farcasterUserData[fid]) {
      upsertFarcasterUserData({ fid });
    }
  }, [fid, farcasterUserData]);

  const { farcasterUserStats } = useFarcasterUserStats(fid);

  const platformAccounts: PlatformAccountData[] = useMemo(() => {
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
          name: getName(lensProfile),
          handle: getHandle(lensProfile),
          id: lensProfile.id,
          bio: getBio(lensProfile),
          address: getOwnedByAddress(lensProfile),
        });
      }
    }
    return accounts;
  }, [lensProfiles, fcastBioLinks, fid]);

  const postCount = useMemo(() => {
    const lensCount = lensProfileFirst?.stats.posts || 0;
    return lensCount + farcasterUserStats.postCount || 0;
  }, [lensProfileFirst, farcasterUserStats]);

  const followerCount = useMemo(() => {
    const lensCount = lensProfileFirst?.stats.followers || 0;
    return lensCount + farcasterUserStats.followerCount;
  }, [lensProfileFirst, farcasterUserStats]);

  const followingCount = useMemo(() => {
    const lensCount = lensProfileFirst?.stats.following || 0;
    return lensCount + farcasterUserStats.followingCount;
  }, [lensProfileFirst, farcasterUserStats]);

  return {
    fid,
    lensProfileFirst,
    lensProfiles,
    recommendAddress,
    platformAccounts,
    postCount,
    followerCount,
    followingCount,
    bioLinkLoading,
    lensProfilesLoading,
    fidLoading,
    loading: bioLinkLoading || fidLoading || lensProfilesLoading,
  };
}
