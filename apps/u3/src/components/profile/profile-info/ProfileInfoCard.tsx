import { useProfileState } from '@us3r-network/profile';
import { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import useDid from '../../../hooks/profile/useDid';
// import Loading from '../../common/loading/Loading';
import U3ProfileInfoCardContainer from './U3ProfileInfoCardContainer';
import PlatformProfileInfoCardContainer from './PlatformProfileInfoCardContainer';
import { isDidPkh } from '../../../utils/shared/did';
import { getProfileShareUrl } from '../../../utils/shared/share';
// import UserTagsStyled from '../UserTagsStyled';
// import UserWalletsStyled from '../UserWalletsStyled';

interface ProfileInfoCardProps extends StyledComponentPropsWithRef<'div'> {
  isSelf?: boolean;
  identity: string;
  canNavigateToProfile?: boolean;
  onNavigateToProfileAfter?: () => void;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function ProfileInfoCard({
  identity,
  isSelf,
  canNavigateToProfile,
  onNavigateToProfileAfter,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: ProfileInfoCardProps) {
  const { did, loading: didLoading } = useDid(identity);
  const { getProfileWithDid } = useProfileState();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasProfileLoading, setHasProfileLoading] = useState(false);
  console.log('ProfileInfoCard: identity', identity, did);
  useEffect(() => {
    (async () => {
      if (isDidPkh(did)) {
        setHasProfileLoading(true);
        const profile = await getProfileWithDid(did);
        if (profile) {
          setHasProfile(true);
        }
        setHasProfileLoading(false);
      } else {
        setHasProfile(false);
      }
    })();
  }, [did]);

  const shareLink = useMemo(() => getProfileShareUrl(identity), [identity]);
  const navigateToProfileUrl = useMemo(
    () => (canNavigateToProfile ? `/u/${identity}` : undefined),
    [canNavigateToProfile, identity]
  );
  if (didLoading || hasProfileLoading) {
    return null;
    // return (
    //   <LoadingWrapper {...wrapperProps}>
    //     <Loading />
    //   </LoadingWrapper>
    // );
  }
  if (did && hasProfile) {
    console.log('ProfileInfoCard: U3ProfileInfoCardContainer', did);
    return (
      <>
        <U3ProfileInfoCardContainer
          isSelf={isSelf}
          did={did}
          navigateToProfileUrl={navigateToProfileUrl}
          onNavigateToProfileAfter={onNavigateToProfileAfter}
          clickFollowing={clickFollowing}
          clickFollowers={clickFollowers}
          shareLink={shareLink}
          {...wrapperProps}
        />
        {/* <UserWalletsStyled did={did} />
        <UserTagsStyled did={did} /> */}
      </>
    );
  }
  if (identity) {
    return (
      <PlatformProfileInfoCardContainer
        isSelf={isSelf}
        identity={identity}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
        clickFollowing={clickFollowing}
        clickFollowers={clickFollowers}
        shareLink={shareLink}
        {...wrapperProps}
      />
    );
  }
  return null;
}
