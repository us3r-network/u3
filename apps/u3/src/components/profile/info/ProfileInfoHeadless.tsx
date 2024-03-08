import { PropsWithChildren } from 'react';
import { Profile as U3Profile } from '@us3r-network/data-model';
import useDid from '@/hooks/profile/useDid';
import useHasU3ProfileWithDid from '@/hooks/profile/useHasU3ProfileWithDid';
import { ChildrenRenderProps, childrenRender } from '@/utils/shared/props';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';

export type U3ProfileInfoRenderProps = ReturnType<typeof useU3ProfileInfoData>;
export type PlatformProfileInfoRenderProps = ReturnType<
  typeof usePlatformProfileInfoData
>;

type ProfileInfoRenderCommonProps = {
  did: string;
  didLoading: boolean;
  hasU3ProfileLoading: boolean;
  u3Profile: U3Profile;
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
export default function ProfileInfoHeadless({
  identity,
  isSelf,
  ...props
}: ProfileInfoProps) {
  const { did, loading: didLoading } = useDid(identity);
  const { u3Profile, hasU3ProfileLoading } = useHasU3ProfileWithDid(did);
  if (didLoading || hasU3ProfileLoading) {
    return childrenRender(
      props?.children,
      { did, u3Profile, didLoading, hasU3ProfileLoading },
      null
    );
  }
  if (did && u3Profile) {
    // return <U3ProfileInfoHeadless did={did} isSelf={isSelf} {...props} />;
    return null;
  }
  return null;
  // return <PlatformProfileInfoHeadless did={did} isSelf={isSelf} {...props} />;
}

export interface U3ProfileInfoProps
  extends ChildrenRenderProps<PropsWithChildren, U3ProfileInfoRenderProps> {
  did: string;
  isSelf?: boolean;
}
function U3ProfileInfoHeadless({ did, isSelf, children }: U3ProfileInfoProps) {
  const u3ProfileInfoData = useU3ProfileInfoData({ did, isSelf: !!isSelf });
  return childrenRender(children, { ...u3ProfileInfoData }, null);
}

export interface PlatformProfileInfoProps
  extends ChildrenRenderProps<
    PropsWithChildren,
    PlatformProfileInfoRenderProps
  > {
  did: string;
  isSelf?: boolean;
}
function PlatformProfileInfoHeadless({
  did,
  isSelf,
  children,
}: PlatformProfileInfoProps) {
  const u3ProfileInfoData = useU3ProfileInfoData({ did, isSelf: !!isSelf });
  return childrenRender(children, { ...u3ProfileInfoData }, null);
}
