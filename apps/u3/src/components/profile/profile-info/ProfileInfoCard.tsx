import { useProfileState } from '@us3r-network/profile';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useState } from 'react';
import useDid from '../../../hooks/profile/useDid';
import Loading from '../../common/loading/Loading';
import U3ProfileInfoCardContainer from './U3ProfileInfoCardContainer';
import PlatformProfileInfoCardContainer from './PlatformProfileInfoCardContainer';
import { isDidPkh } from '../../../utils/shared/did';

interface ProfileInfoCardProps extends StyledComponentPropsWithRef<'div'> {
  identity: string;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function ProfileInfoCard({
  identity,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: ProfileInfoCardProps) {
  const { did, loading: didLoading } = useDid(identity);
  const { getProfileWithDid } = useProfileState();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasProfileLoading, setHasProfileLoading] = useState(false);
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

  if (didLoading || hasProfileLoading) {
    return (
      <LoadingWrapper {...wrapperProps}>
        <Loading />
      </LoadingWrapper>
    );
  }
  if (did && hasProfile) {
    return (
      <U3ProfileInfoCardContainer
        did={did}
        clickFollowing={clickFollowing}
        clickFollowers={clickFollowers}
        {...wrapperProps}
      />
    );
  }
  if (identity) {
    return (
      <PlatformProfileInfoCardContainer
        identity={identity}
        clickFollowing={clickFollowing}
        clickFollowers={clickFollowers}
        {...wrapperProps}
      />
    );
  }
  return null;
}

const LoadingWrapper = styled.div`
  padding: 20px;
  width: 360px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
