import styled from 'styled-components';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { FeedsType } from 'src/components/social/SocialPageNav';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useLogin from 'src/hooks/shared/useLogin';
import NoLogin from 'src/components/layout/NoLogin';
import FollowingDefault from 'src/components/social/FollowingDefault';

export default function SocialFarcaster() {
  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>(); // TODO: any

  const currentFeedType = useRef<FeedsType>();
  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();
  const { isLogin } = useLogin();

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!isConnectedFarcaster) {
      return (
        <MainCenter>
          <FollowingDefault farcaster />
        </MainCenter>
      );
    }
  }

  return (
    <FarcasterListBox>
      <Outlet
        context={{
          feedsType,
          postScroll,
          setPostScroll,
        }}
      />
    </FarcasterListBox>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;

const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;

const FarcasterListBox = styled.div``;
