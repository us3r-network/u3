import { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useMemo } from 'react';
import { useProfilesOwnedBy } from '@lens-protocol/react-web';

import { PlatformAccountsData } from './PlatformAccounts';
import { getAddressWithDidPkh } from '../../../utils/did';
import getAvatar from '../../../utils/lens/getAvatar';
import { SocailPlatform } from '../../../api';
import { useFarcasterCtx } from '../../../contexts/FarcasterCtx';
import useFarcasterUserData from '../../../hooks/farcaster/useFarcasterUserData';
import useUpsertFarcasterUserData from '../../../hooks/farcaster/useUpsertFarcasterUserData';
import useFarcasterFollowNum from '../../../hooks/farcaster/useFarcasterFollowNum';
import useBioLinkListWithDid from '../../../hooks/profile/useBioLinkListWithDid';
import ProfileInfoBaseCard from './ProfileInfoBaseCard';
import useBioLinkListWithWeb3Bio from '../../../hooks/profile/useBioLinkListWithWeb3Bio';
import useLazyQueryFidWithAddress from '../../../hooks/farcaster/useLazyQueryFidWithAddress';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../../utils/profile/biolink';

interface HasU3ProfileInfoCardProps extends StyledComponentPropsWithRef<'div'> {
  did: string;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function HasU3ProfileInfoCard({
  did,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: HasU3ProfileInfoCardProps) {
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

  const { lensBioLinks: web3LensBioLinks, fcastBioLinks: web3FcastBioLinks } =
    useBioLinkListWithWeb3Bio(identity);

  const { fetch: fetchFid, fid: fetchedFid } = useLazyQueryFidWithAddress(
    web3FcastBioLinks?.[0]?.address || ''
  );
  useEffect(() => {
    fetchFid();
  }, [web3FcastBioLinks]);

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

  const platformAccounts: PlatformAccountsData = useMemo(() => {
    const accounts = [];
    if (lensProfiles?.length > 0) {
      for (const lensProfile of lensProfiles) {
        accounts.push({
          platform: SocailPlatform.Lens,
          avatar: getAvatar(lensProfile),
          name: lensProfile.name,
          handle: lensProfile.handle,
        });
      }
    }

    if (userData?.fid && userData?.display) {
      accounts.push({
        platform: SocailPlatform.Farcaster,
        avatar: userData.pfp,
        name: userData.userName,
        handle: userData.display,
      });
    }
    return accounts;
  }, [lensProfiles, userData]);

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
