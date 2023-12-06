import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useFarcasterTrending from 'src/hooks/social/farcaster/useFarcasterTrending';
import { LoadingMoreWrapper, PostList } from './CommonStyles';

export default function SocialAllTrending() {
  const [parentId] = useState('social-all-trending');
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>();

  // use farcaster trending temp.
  const {
    loading: farcasterTrendingLoading,
    farcasterTrending,
    farcasterTrendingUserDataObj,
    loadFarcasterTrending,
    pageInfo: farcasterTrendingPageInfo,
  } = useFarcasterTrending();

  const { mounted } = useListScroll(parentId);

  useEffect(() => {
    if (mounted) {
      loadFarcasterTrending();
    }
  }, [mounted, loadFarcasterTrending]);

  const hasMore =
    farcasterTrendingPageInfo?.hasNextPage !== undefined
      ? farcasterTrendingPageInfo?.hasNextPage
      : true;

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={farcasterTrending.length}
      next={() => {
        if (farcasterTrendingLoading) return;
        loadFarcasterTrending();
      }}
      hasMore={hasMore}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {farcasterTrending.map(({ platform, data }) => {
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={farcasterTrendingUserDataObj}
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
