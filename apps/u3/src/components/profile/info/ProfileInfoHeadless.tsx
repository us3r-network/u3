import { PropsWithChildren, useEffect, useMemo } from 'react';
import { Profile as U3Profile } from '@us3r-network/data-model';
import useDid from '@/hooks/profile/useDid';
import useHasU3ProfileWithDid from '@/hooks/profile/useHasU3ProfileWithDid';
import { ChildrenRenderProps, childrenRender } from '@/utils/shared/props';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';
import { getDefaultAvatarWithIdentity } from '@/utils/profile/avatar';
import { shortPubKey } from '@/utils/shared/shortPubKey';
import { PlatformAccountData } from '@/services/social/types';
import { useProfileInfoCtx } from '@/contexts/profile/ProfileInfoCtx';

export type U3ProfileInfoRenderProps = ReturnType<typeof useU3ProfileInfoData>;
export type PlatformProfileInfoRenderProps = ReturnType<
  typeof usePlatformProfileInfoData
>;

type ProfileInfoRenderCommonProps = {
  loading: boolean;
  did?: string;
  u3Profile?: U3Profile | null;
  displayAvatar: string;
  displayName: string;
  displayBio: string;
};
export type ProfileInfoRenderProps =
  | (U3ProfileInfoRenderProps & ProfileInfoRenderCommonProps)
  | (PlatformProfileInfoRenderProps & ProfileInfoRenderCommonProps);

export interface ProfileInfoProps
  extends ChildrenRenderProps<PropsWithChildren, ProfileInfoRenderProps> {
  identity: string;
  isSelf?: boolean;
}
export default function ProfileInfoHeadless(props: ProfileInfoProps) {
  const { identity, children } = props;
  const { isCachedProfileInfo, getCachedProfileInfoWithIdentity } =
    useProfileInfoCtx();

  const isCached = isCachedProfileInfo(identity);
  const cachedData = getCachedProfileInfoWithIdentity(identity);
  const { address, recommendAddress, u3Profile, platformAccounts } =
    cachedData || {};
  const displayInfo = getDisplayInfo({
    address: address || recommendAddress,
    u3Profile,
    platformAccounts,
  });

  if (isCached) {
    return childrenRender(children, { ...cachedData, ...displayInfo }, null);
  }
  return <LoadProfileInfoHeadless {...props} />;
}

function LoadProfileInfoHeadless({
  identity,
  isSelf,
  ...props
}: ProfileInfoProps) {
  const { did, loading: didLoading } = useDid(identity);
  const { u3Profile, hasU3ProfileLoading } = useHasU3ProfileWithDid(did);
  if (didLoading || hasU3ProfileLoading) {
    return childrenRender(
      props?.children,
      { did, u3Profile, loading: true },
      null
    );
  }
  if (did && u3Profile) {
    return (
      <U3ProfileInfoHeadless
        identity={identity}
        did={did}
        isSelf={isSelf}
        u3Profile={u3Profile}
        {...props}
      />
    );
  }
  return <PlatformProfileInfoHeadless identity={identity} {...props} />;
}

const getDisplayInfo = ({
  address,
  u3Profile,
  platformAccounts,
}: {
  address: string;
  platformAccounts: PlatformAccountData[] | null;
  u3Profile?: U3Profile;
}) => {
  const displayAvatar =
    u3Profile?.avatar ||
    platformAccounts?.[0]?.avatar ||
    getDefaultAvatarWithIdentity(
      address || String(platformAccounts?.[0]?.id) || ''
    );
  const displayName =
    u3Profile?.name || platformAccounts?.[0]?.name || shortPubKey(address);
  const displayBio =
    u3Profile?.bio || platformAccounts?.[0]?.bio || 'There is nothing here';
  return {
    displayAvatar,
    displayName,
    displayBio,
  };
};
export interface U3ProfileInfoProps
  extends ChildrenRenderProps<
    PropsWithChildren,
    U3ProfileInfoRenderProps & ProfileInfoRenderCommonProps
  > {
  identity: string;
  did: string;
  u3Profile: U3Profile;
  isSelf?: boolean;
}
function U3ProfileInfoHeadless({
  identity,
  did,
  u3Profile,
  isSelf,
  children,
}: U3ProfileInfoProps) {
  const profileInfoData = useU3ProfileInfoData({
    did,
    isSelf: !!isSelf,
  });
  const { loading } = profileInfoData;
  const { address, platformAccounts } = profileInfoData;
  const displayInfo = getDisplayInfo({
    address,
    u3Profile,
    platformAccounts,
  });
  const data = useMemo(
    () => ({ did, u3Profile, ...profileInfoData }),
    [did, u3Profile, profileInfoData]
  );
  useCacheProfileInfo(identity, loading, data);
  return childrenRender(children, { ...data, ...displayInfo }, null);
}

export interface PlatformProfileInfoProps
  extends ChildrenRenderProps<
    PropsWithChildren,
    PlatformProfileInfoRenderProps & ProfileInfoRenderCommonProps
  > {
  identity: string;
}
function PlatformProfileInfoHeadless({
  identity,
  children,
}: PlatformProfileInfoProps) {
  const profileInfoData = usePlatformProfileInfoData({ identity });
  const { loading } = profileInfoData;
  const { recommendAddress: address, platformAccounts } = profileInfoData;
  const displayInfo = getDisplayInfo({
    address,
    platformAccounts,
  });
  useCacheProfileInfo(identity, loading, profileInfoData);

  return childrenRender(children, { ...profileInfoData, ...displayInfo }, null);
}

function useCacheProfileInfo(identity: string, loading: boolean, data: any) {
  const {
    addLoadingIdentity,
    removeLoadingIdentity,
    upsertCachedProfileInfoWithIdentity,
  } = useProfileInfoCtx();

  useEffect(() => {
    if (loading) {
      addLoadingIdentity(identity);
    } else {
      removeLoadingIdentity(identity);
    }
  }, [identity, loading, addLoadingIdentity, removeLoadingIdentity]);

  useEffect(() => {
    if (!loading && data) {
      upsertCachedProfileInfoWithIdentity(identity, data);
    }
  }, [identity, loading, data, upsertCachedProfileInfoWithIdentity]);
}
