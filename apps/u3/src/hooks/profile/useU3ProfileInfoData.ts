import { useEffect, useMemo } from 'react';
import { useProfiles } from '@lens-protocol/react-web';
import useBioLinkListWithDid from './useBioLinkListWithDid';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import useBioLinkListWithWeb3Bio from './useBioLinkListWithWeb3Bio';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { getAddressWithDidPkh } from '../../utils/shared/did';
import useUpsertFarcasterUserData from '../social/farcaster/useUpsertFarcasterUserData';
import useFarcasterFollowNum from '../social/farcaster/useFarcasterFollowNum';
import useFarcasterUserData from '../social/farcaster/useFarcasterUserData';
import { PlatformAccountsData } from '../../components/profile/profile-info/PlatformAccounts';
import { SocialPlatform } from '../../services/social/types';
import getAvatar from '../../utils/social/lens/getAvatar';
import {
  getBio,
  getHandle,
  getName,
  getOwnedByAddress,
} from '../../utils/social/lens/profile';
import useFetchFidWithFname from '../social/farcaster/useFetchFidWithFname';

export default function useU3ProfileInfoData({
  did,
  isSelf,
}: {
  did: string;
  isSelf: boolean;
}) {
  const {
    lensBioLinkProfiles,
    fcastBioLinkProfiles,
    loading: bioLinkLoading,
  } = useBioLinkListWithDid(did);

  const { currFid } = useFarcasterCtx();

  const identity = useMemo(() => {
    // 如果绑定了 lens，但没绑定 farcaster，则取 lens 的 identity(address/handle) 去web3.bio查询其它平台信息
    if (lensBioLinkProfiles.length > 0 && fcastBioLinkProfiles.length === 0) {
      return (
        getOwnedByAddress(lensBioLinkProfiles[0]) ||
        lensHandleToBioLinkHandle(getHandle(lensBioLinkProfiles[0])) ||
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
    loading: web3BioLoading,
  } = useBioLinkListWithWeb3Bio(identity);

  const fname = web3FcastBioLinks?.[0]?.identity;
  const {
    fid: fetchedFid,
    fetchFid,
    loading: fidLoading,
  } = useFetchFidWithFname();

  useEffect(() => {
    if (fname) {
      fetchFid(fname);
    }
  }, [fetchFid, fname]);

  const { farcasterUserData } = useFarcasterCtx();

  const address = getAddressWithDidPkh(did);

  const ownedBy =
    getOwnedByAddress(lensBioLinkProfiles?.[0]) ||
    web3LensBioLinks?.[0]?.address ||
    address ||
    '';
  const { data: lensProfiles, loading: lensProfilesLoading } = useProfiles({
    where: {
      ownedBy: [ownedBy],
    },
  });
  const lensProfileFirst = lensProfiles?.[0];

  const fid = isSelf ? currFid : fcastBioLinkProfiles?.[0]?.fid || fetchedFid;
  const { upsertFarcasterUserData } = useUpsertFarcasterUserData();
  useEffect(() => {
    if (fid && !farcasterUserData[fid]) {
      upsertFarcasterUserData({ fid });
    }
  }, [fid, farcasterUserData]);

  const { farcasterFollowData } = useFarcasterFollowNum(`${fid}`);

  const userData = useFarcasterUserData({
    fid: `${fid}`,
    farcasterUserData,
  });

  const platformAccounts = useMemo(() => {
    const accounts: PlatformAccountsData = [];
    if (userData?.fid && userData?.display) {
      accounts.push({
        platform: SocialPlatform.Farcaster,
        avatar: userData.pfp,
        name: userData.display,
        handle: userData.userName,
        id: userData.fid,
        bio: userData.bio,
        address: web3FcastBioLinks?.[0]?.address || '',
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
  }, [lensProfiles, userData, web3FcastBioLinks]);

  const followersCount = useMemo(() => {
    const lensFollowersCount = lensProfileFirst?.stats.followers || 0;

    return lensFollowersCount + farcasterFollowData.followers || 0;
  }, [lensProfileFirst, farcasterFollowData]);

  const followingCount = useMemo(() => {
    const lensFollowersCount = lensProfileFirst?.stats.following || 0;

    return lensFollowersCount + farcasterFollowData.following || 0;
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
