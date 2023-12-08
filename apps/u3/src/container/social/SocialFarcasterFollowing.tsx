import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';

import FollowingDefault from 'src/components/social/FollowingDefault';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useFarcasterFollowing from 'src/hooks/social/farcaster/useFarcasterFollowing';
import useLogin from 'src/hooks/shared/useLogin';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
  MainCenter,
  NoLoginStyled,
  PostList,
} from './CommonStyles';

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
  }, [mounted, isLogin, isConnectedFarcaster]);

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
      hasMore={farcasterFollowingPageInfo.hasNextPage}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
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
