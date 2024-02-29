import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useListScroll from '@/hooks/social/useListScroll';
import { getCommunityPostDetailShareUrlWithFarcaster } from '@/utils/shared/share';
import { getCommunityFcPostDetailPath } from '@/route/path';
import {
  LoadingMoreWrapper,
  LoadingWrapper,
  PostList,
} from '@/components/social/CommonStyles';

export default function PostsFcNewest() {
  const [parentId] = useState('community-posts-fc-newest');
  const { mounted } = useListScroll(parentId);
  const { openFarcasterQR } = useFarcasterCtx();
  const {
    channelId,

    fcNewestFeeds,
    fcNewestPageInfo,
    fcNewestFirstLoading,
    fcNewestMoreLoading,
    loadFcNewestMoreFeeds,
    fcUserDataObj,

    setPostScroll,
  } = useOutletContext<any>();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {(fcNewestFirstLoading && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )) || (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={fcNewestFeeds.length}
          next={() => {
            if (fcNewestMoreLoading) return;
            loadFcNewestMoreFeeds();
          }}
          hasMore={fcNewestPageInfo?.hasNextPage || false}
          scrollThreshold={FEEDS_SCROLL_THRESHOLD}
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollableTarget="community-posts-scroll-wrapper"
        >
          <PostList>
            {fcNewestFeeds.map(({ platform, data }) => {
              if (platform === 'farcaster') {
                const key = Buffer.from(data.hash.data).toString('hex');
                return (
                  <FCast
                    isV2Layout
                    key={key}
                    cast={data}
                    openFarcasterQR={openFarcasterQR}
                    farcasterUserData={{}}
                    farcasterUserDataObj={fcUserDataObj}
                    shareLink={getCommunityPostDetailShareUrlWithFarcaster(
                      channelId,
                      key
                    )}
                    castClickAction={(e, castHex) => {
                      setPostScroll({
                        currentParent: parentId,
                        id: key,
                        top: (e.target as HTMLDivElement).offsetTop,
                      });
                      navigate(
                        getCommunityFcPostDetailPath(channelId, castHex)
                      );
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
