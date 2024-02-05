import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import {
  LoadingMoreWrapper,
  LoadingWrapper,
} from '@/components/profile/FollowListWidgets';
import { PostList } from '../social/CommonStyles';

export default function PostsFcTrending() {
  const [parentId] = useState('posts-fc-trending');
  const { openFarcasterQR } = useFarcasterCtx();
  const {
    fcTrendFeeds,
    fcTrendPageInfo,
    fcTrendFirstLoading,
    fcTrendMoreLoading,
    loadFcTrendMoreFeeds,
    fcUserDataObj,

    setPostScroll,
  } = useOutletContext<any>();

  return (
    <div className="w-full">
      {(fcTrendFirstLoading && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )) || (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={fcTrendFeeds.length}
          next={() => {
            if (fcTrendMoreLoading) return;
            loadFcTrendMoreFeeds();
          }}
          hasMore={fcTrendPageInfo?.hasNextPage || false}
          scrollThreshold={FEEDS_SCROLL_THRESHOLD}
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollableTarget="posts-scroll-wrapper"
        >
          <PostList className="w-full rounded-none">
            {fcTrendFeeds.map(({ platform, data }) => {
              if (platform === 'farcaster') {
                const key = Buffer.from(data.hash.data).toString('hex');
                return (
                  <FCast
                    key={key}
                    cast={data}
                    openFarcasterQR={openFarcasterQR}
                    farcasterUserData={{}}
                    farcasterUserDataObj={fcUserDataObj}
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
      )}
    </div>
  );
}
