import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';

import FollowingDefault from 'src/components/social/FollowingDefault';
import NoLogin from 'src/components/layout/NoLogin';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useFarcasterFollowing from 'src/hooks/social/farcaster/useFarcasterFollowing';
import useLogin from 'src/hooks/shared/useLogin';

export default function SocialFarcaster() {
  const [parentId] = useState('social-farcaster-following');
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);
  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();
  const { isLogin } = useLogin();

  const {
    farcasterFollowing,
    loadFarcasterFollowing,
    loading: farcasterFollowingLoading,
    pageInfo: farcasterFollowingPageInfo,
    farcasterFollowingUserDataObj,
  } = useFarcasterFollowing();

  useEffect(() => {
    if (!mounted) return;
    if (!isLogin) return;
    if (!isConnectedFarcaster) return;
    loadFarcasterFollowing();
  }, [loadFarcasterFollowing, mounted, isLogin, isConnectedFarcaster]);

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

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={farcasterFollowing.length}
      next={() => {
        if (farcasterFollowingLoading) return;
        loadFarcasterFollowing();
      }}
      hasMore={farcasterFollowingPageInfo.hasNextPage || true}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {farcasterFollowing.map(({ platform, data }) => {
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={farcasterFollowingUserDataObj}
                showMenuBtn
                cardClickAction={(e) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: key,
                    top: (e.target as HTMLDivElement).offsetTop,
                  });
                }}
              />
            );
          }
          return null;
        })}
      </PostList>
    </InfiniteScroll>
  );
}

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  background: #212228;
  overflow: hidden;
  & > * {
    border-top: 1px solid #718096;
  }
`;

const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const MainCenter = styled.div`
  width: 100%;
`;

const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;
