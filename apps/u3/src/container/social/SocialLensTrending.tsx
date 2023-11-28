import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useListScroll from 'src/hooks/social/useListScroll';

export default function SocialLensTrending() {
  const [parentId] = useState('social-lens-trending');

  const { loadLensTrending } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);

  useEffect(() => {
    if (mounted) {
      loadLensTrending();
    }
  }, [mounted, loadLensTrending]);

  return (
    <div>
      lens trending
      {/* <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={feeds.length}
          next={() => {
            if (moreLoading) return;
            loadMoreFeeds();
          }}
          hasMore={!firstLoading && pageInfo?.hasNextPage}
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollThreshold={FEEDS_SCROLL_THRESHOLD}
          scrollableTarget="social-scroll-wrapper"
        >
          <PostList>
            {feeds.map(({ platform, data, ...args }) => {
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
        </InfiniteScroll> */}
    </div>
  );
}
