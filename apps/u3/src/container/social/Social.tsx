import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { FeedsType } from '../../components/social/SocialPageNav';

import AddPostForm from '../../components/social/AddPostForm';
import FollowingDefault from '../../components/social/FollowingDefault';
import useLogin from '../../hooks/shared/useLogin';
import { AddPostFormWrapper, NoLoginStyled } from './CommonStyles';
import { useLensCtx } from '../../contexts/social/AppLensCtx';

export default function SocialAll() {
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const currentFeedType = useRef<FeedsType>();
  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>(); // TODO: any type

  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();

  // const [searchParams] = useSearchParams();
  // const currentSearchParams = useMemo(
  //   () => ({
  //     keyword: searchParams.get('keyword') || '',
  //   }),
  //   [searchParams]
  // );

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!isConnectedFarcaster && !lensSessionProfileId) {
      return (
        <MainCenter>
          <FollowingDefault farcaster lens />
        </MainCenter>
      );
    }
  }

  return (
    <MainCenter>
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>
      <Outlet
        context={{
          feedsType,
          postScroll,
          setPostScroll,
        }}
      />
    </MainCenter>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;
