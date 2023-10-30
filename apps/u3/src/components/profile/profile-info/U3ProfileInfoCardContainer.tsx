import { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useMemo } from 'react';
import { useProfilesOwnedBy } from '@lens-protocol/react-web';

import { PlatformAccountsData } from './PlatformAccounts';
import { getAddressWithDidPkh } from '../../../utils/shared/did';
import getAvatar from '../../../utils/social/lens/getAvatar';
import { SocailPlatform } from '../../../services/social/types';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import useFarcasterUserData from '../../../hooks/social/farcaster/useFarcasterUserData';
import useUpsertFarcasterUserData from '../../../hooks/social/farcaster/useUpsertFarcasterUserData';
import useFarcasterFollowNum from '../../../hooks/social/farcaster/useFarcasterFollowNum';
import useBioLinkListWithDid from '../../../hooks/profile/useBioLinkListWithDid';
import ProfileInfoBaseCard from './ProfileInfoCardLayout';
import useBioLinkListWithWeb3Bio from '../../../hooks/profile/useBioLinkListWithWeb3Bio';
import useLazyQueryFidWithAddress from '../../../hooks/social/farcaster/useLazyQueryFidWithAddress';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../../utils/profile/biolink';

interface U3ProfileInfoCardContainerProps
  extends StyledComponentPropsWithRef<'div'> {
  did: string;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function U3ProfileInfoCardContainer({
  did,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: U3ProfileInfoCardContainerProps) {
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
  } = useBioLinkListWithWeb3Bio(identity);

  const { fetch: fetchFid, fid: fetchedFid } = useLazyQueryFidWithAddress(
    web3FcastBioLinks?.[0]?.address || recommendAddress
  );
  useEffect(() => {
    fetchFid();
  }, [fetchFid]);

  const { farcasterUserData } = useFarcasterCtx();

  const address = getAddressWithDidPkh(did);

  const { data: lensProfiles } = useProfilesOwnedBy({
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

  return (
    <ProfileInfoBaseCard
      isU3Profile
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
