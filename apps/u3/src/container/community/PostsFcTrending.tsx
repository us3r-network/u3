import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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
import useListScroll from '@/hooks/social/useListScroll';

export default function PostsFcTrending() {
  const [parentId] = useState('posts-fc-trending');
  const { mounted } = useListScroll(parentId);
  const { openFarcasterQR } = useFarcasterCtx();
  const {
    channelId,

    fcTrendFeeds,
    fcTrendPageInfo,
    fcTrendFirstLoading,
    fcTrendMoreLoading,
    loadFcTrendMoreFeeds,
    fcUserDataObj,

    setPostScroll,
  } = useOutletContext<any>();
  const navigate = useNavigate();

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
          <PostList className="w-full rounded-none" style={{ borderRadius: 0 }}>
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
                    onClick={(e) => {
                      const id = Buffer.from(data.hash).toString('hex');

                      setPostScroll({
                        currentParent: parentId,
                        id: key,
                        top: (e.target as HTMLDivElement).offsetTop,
                      });
                      navigate(`/community/${channelId}/posts/fc/${id}`);
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
