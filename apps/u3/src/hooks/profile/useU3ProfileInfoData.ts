import { useEffect, useMemo } from 'react';
import { useProfilesOwnedBy } from '@lens-protocol/react-web';
import useBioLinkListWithDid from './useBioLinkListWithDid';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import useBioLinkListWithWeb3Bio from './useBioLinkListWithWeb3Bio';
import useLazyQueryFidWithAddress from '../social/farcaster/useLazyQueryFidWithAddress';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { getAddressWithDidPkh } from '../../utils/shared/did';
import useUpsertFarcasterUserData from '../social/farcaster/useUpsertFarcasterUserData';
import useFarcasterFollowNum from '../social/farcaster/useFarcasterFollowNum';
import useFarcasterUserData from '../social/farcaster/useFarcasterUserData';
import { PlatformAccountsData } from '../../components/profile/profile-info/PlatformAccounts';
import { SocailPlatform } from '../../services/social/types';
import getAvatar from '../../utils/social/lens/getAvatar';

export default function useU3ProfileInfoData({ did }: { did: string }) {
  const {
    lensBioLinkProfiles,
    fcastBioLinkProfiles,
    loading: bioLinkLoading,
  } = useBioLinkListWithDid(did);

  const identity = useMemo(() => {
    // 如果绑定了 lens，但没绑定 farcaster，则取 lens 的 identity(address/handle) 去web3.bio查询其它平台信息
    if (lensBioLinkProfiles.length > 0 && fcastBioLinkProfiles.length === 0) {
      return (
        lensBioLinkProfiles[0]?.ownedBy ||
        lensHandleToBioLinkHandle(lensBioLinkProfiles[0]?.handle) ||
        ''
      );
    }
    // 如果绑定了 farcaster，但没绑定 lens，则取 farcaster 的 identity(handle) 去 web3.bio 查询其它平台信息
    if (fcastBioLinkProfiles.length > 0 && lensBioLinkProfiles.length === 0) {
      return farcasterHandleToBioLinkHandle(fcastBioLinkProfiles[0]?.value);
    }

    return '';
  }, [lensBioLinkProfiles, fcastBioLinkProfiles]);

  const {
    lensBioLinks: web3LensBioLinks,
    fcastBioLinks: web3FcastBioLinks,
    recommendAddress,
    loading: web3BioLoading,
  } = useBioLinkListWithWeb3Bio(identity);

  const {
    fetch: fetchFid,
    fid: fetchedFid,
    loading: fidLoading,
  } = useLazyQueryFidWithAddress(
    web3FcastBioLinks?.[0]?.address || recommendAddress
  );
  useEffect(() => {
    fetchFid();
  }, [fetchFid]);

  const { farcasterUserData } = useFarcasterCtx();

  const address = getAddressWithDidPkh(did);

  const { data: lensProfiles, loading: lensProfilesLoading } =
    useProfilesOwnedBy({
      address:
        lensBioLinkProfiles?.[0]?.ownedBy ||
        web3LensBioLinks?.[0]?.address ||
        address ||
        '',
    });
  const lensProfileFirst = lensProfiles?.[0];

  const fid = fcastBioLinkProfiles?.[0]?.fid || fetchedFid;
  const { upsertFarcasterUserData } = useUpsertFarcasterUserData();
  useEffect(() => {
    if (fid && !farcasterUserData[fid]) {
      upsertFarcasterUserData({ fid });
    }
  }, [fid, farcasterUserData]);

  const { farcasterFollowData } = useFarcasterFollowNum(fid);

  const userData = useFarcasterUserData({
    fid: `${fid}`,
    farcasterUserData,
  });

  const platformAccounts = useMemo(() => {
    const accounts: PlatformAccountsData = [];
    if (userData?.fid && userData?.display) {
      accounts.push({
        platform: SocailPlatform.Farcaster,
        avatar: userData.pfp,
        name: userData.userName,
        handle: userData.display,
        id: userData.fid,
        bio: userData.bio,
        address: web3FcastBioLinks?.[0]?.address || '',
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
  }, [lensProfiles, userData, web3FcastBioLinks]);

  const followersCount = useMemo(() => {
    const lensFollowersCount = lensProfileFirst?.stats.totalFollowers || 0;

    return lensFollowersCount + farcasterFollowData.followers;
  }, [lensProfileFirst, farcasterFollowData]);

  const followingCount = useMemo(() => {
    const lensFollowersCount = lensProfileFirst?.stats.totalFollowing || 0;

    return lensFollowersCount + farcasterFollowData.following;
  }, [lensProfileFirst, farcasterFollowData]);

  return {
    fid,
    lensProfileFirst,
    address,
    lensProfiles,
    platformAccounts,
    followersCount,
    followingCount,
    farcasterFollowData,
    bioLinkLoading,
    web3BioLoading,
    fidLoading,
    lensProfilesLoading,
    loading:
      bioLinkLoading || web3BioLoading || fidLoading || lensProfilesLoading,
  };
}
