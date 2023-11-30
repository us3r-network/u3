import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import useLensTrending from 'src/hooks/social/lens/useLensTrending';
import useListScroll from 'src/hooks/social/useListScroll';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import Loading from 'src/components/common/loading/Loading';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';

import { LoadingMoreWrapper, PostList } from './CommonStyles';

export default function SocialLensTrending() {
  const [parentId] = useState('social-lens-trending');

  const { setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);

  const { loadLensTrending, loading, lensTrending, pageInfo } =
    useLensTrending();

  useEffect(() => {
    if (mounted) {
      loadLensTrending();
    }
  }, [mounted, loadLensTrending]);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={lensTrending.length}
      next={() => {
        if (loading) return;
        loadLensTrending();
      }}
      hasMore={pageInfo.hasNextPage || true}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {lensTrending.map(({ platform, data }) => {
          if (platform === 'lens') {
            return (
              <LensPostCard
                key={data.id}
                data={data}
                cardClickAction={(e) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: data.id,
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
