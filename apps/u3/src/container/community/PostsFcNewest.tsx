import { useEffect, useState } from 'react';
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
  EndMsgContainer,
  LoadingMoreWrapper,
  PostList,
} from '@/components/social/CommonStyles';
import useChannelFeeds from '@/hooks/social/useChannelFeeds';

export default function PostsFcNewest() {
  const [parentId] = useState('community-posts-fc-newest');
  const { mounted } = useListScroll(parentId);
  const navigate = useNavigate();

  const { openFarcasterQR } = useFarcasterCtx();
  const { channelId, setPostScroll, postsCachedData } = useOutletContext<any>();
  const whatsnewCachedData = postsCachedData?.fc?.whatsnew;

  const {
    loading,
    loadFarcasterWhatsnew,
    farcasterWhatsnew,
    farcasterWhatsnewUserDataObj,
    pageInfo,
  } = useChannelFeeds({
    channelId,
    cachedDataRefValue: whatsnewCachedData,
  });

  useEffect(() => {
    if (mounted && !whatsnewCachedData?.data?.length) {
      loadFarcasterWhatsnew();
    }
  }, [mounted]);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={farcasterWhatsnew.length}
      next={() => {
        if (loading) return;
        loadFarcasterWhatsnew();
      }}
      hasMore={pageInfo.hasNextPage}
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
        {farcasterWhatsnew.map(({ platform, data }) => {
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                isV2Layout
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={farcasterWhatsnewUserDataObj}
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
  );
}
