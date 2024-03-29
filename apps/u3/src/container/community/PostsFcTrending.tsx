import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useListScroll from '@/hooks/social/useListScroll';
import useFarcasterTrending from '@/hooks/social/farcaster/useFarcasterTrending';
import { getCommunityPostDetailShareUrlWithFarcaster } from '@/utils/shared/share';
import { getCommunityFcPostDetailPath } from '@/route/path';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
  PostList,
} from '@/components/social/CommonStyles';

export default function PostsFcTrending() {
  const [parentId] = useState('community-posts-fc-trending');
  const { mounted } = useListScroll(parentId);
  const { openFarcasterQR } = useFarcasterCtx();
  const { channelId, setPostScroll, postsCachedData } = useOutletContext<any>();
  const trendingCachedData = postsCachedData?.fc?.trending;

  const navigate = useNavigate();

  const {
    loading: farcasterTrendingLoading,
    farcasterTrending,
    farcasterTrendingUserDataObj,
    loadFarcasterTrending,
    pageInfo: farcasterTrendingPageInfo,
  } = useFarcasterTrending({
    channelId,
    cachedDataRefValue: trendingCachedData,
  });

  useEffect(() => {
    if (mounted && !trendingCachedData?.data?.length) {
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
        scrollableTarget="community-posts-scroll-wrapper"
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
                    navigate(getCommunityFcPostDetailPath(channelId, castHex));
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
