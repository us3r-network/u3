import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import { LoadingMoreWrapper } from '@/components/profile/FollowListWidgets';
import useListScroll from '@/hooks/social/useListScroll';
import useFarcasterTrending from '@/hooks/social/farcaster/useFarcasterTrending';
import { EndMsgContainer, PostList } from './CommonStyles';

export default function PostsFcTrending() {
  const [parentId] = useState('posts-fc-trending');
  const { mounted } = useListScroll(parentId);
  const { openFarcasterQR } = useFarcasterCtx();
  const { channelId, setPostScroll } = useOutletContext<any>();
  const navigate = useNavigate();

  const {
    loading: farcasterTrendingLoading,
    farcasterTrending,
    farcasterTrendingUserDataObj,
    loadFarcasterTrending,
    pageInfo: farcasterTrendingPageInfo,
  } = useFarcasterTrending({ channelId });

  useEffect(() => {
    if (mounted) {
      loadFarcasterTrending();
    }
  }, [mounted]);

  return (
    <div className="w-full">
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={farcasterTrending.length}
        next={() => {
          if (farcasterTrendingLoading) return;
          loadFarcasterTrending();
        }}
        hasMore={farcasterTrendingPageInfo.hasNextPage}
        loader={
          <LoadingMoreWrapper>
            <Loading />
          </LoadingMoreWrapper>
        }
        endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
        scrollThreshold={FEEDS_SCROLL_THRESHOLD}
        scrollableTarget="posts-scroll-wrapper"
      >
        <PostList>
          {farcasterTrending.map(({ platform, data }) => {
            if (platform === 'farcaster') {
              const key = Buffer.from(data.hash.data).toString('hex');
              return (
                <FCast
                  isV2Layout
                  key={key}
                  cast={data}
                  openFarcasterQR={openFarcasterQR}
                  farcasterUserData={{}}
                  farcasterUserDataObj={farcasterTrendingUserDataObj}
                  castClickAction={(e, castHex) => {
                    setPostScroll({
                      currentParent: parentId,
                      id: key,
                      top: (e.target as HTMLDivElement).offsetTop,
                    });
                    navigate(`/community/${channelId}/posts/fc/${castHex}`);
                  }}
                />
              );
            }
            return null;
          })}
        </PostList>
      </InfiniteScroll>
    </div>
  );
}
