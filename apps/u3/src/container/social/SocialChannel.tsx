import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import {
  LoadingMoreWrapper,
  LoadingWrapper,
  PostList,
} from '@/components/social/CommonStyles';

export default function SocialChannel() {
  const { openFarcasterQR } = useFarcasterCtx();
  const currentChannelId = useRef('');
  const {
    currentChannel: channel,
    channelFeeds: feeds,
    channelPageInfo: pageInfo,
    channelFirstLoading: firstLoading,
    channelMoreLoading: moreLoading,
    loadChannelMoreFeeds: loadMoreFeeds,
    channelFarcasterUserDataObj: farcasterUserDataObj,

    postScroll,
    setPostScroll,
  } = useOutletContext<any>();

  useEffect(() => {
    if (!channel?.channel_id) return;
    if (currentChannelId.current !== channel.channel_id) {
      document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    }
    currentChannelId.current = channel.channel_id;
  }, [channel?.channel_id]);

  useEffect(() => {
    if (!channel?.channel_id) return;
    if (postScroll.currentParent !== channel?.channel_id) return;
    const focusPost = document.getElementById(postScroll.id);
    focusPost?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'center',
    });
  }, [postScroll, channel?.channel_id]);

  if (!channel) {
    return <div>404</div>;
  }

  return (
    <div>
      {(firstLoading && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )) || (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={feeds.length}
          next={() => {
            if (moreLoading) return;
            loadMoreFeeds();
          }}
          hasMore={pageInfo?.hasNextPage || false}
          scrollThreshold={FEEDS_SCROLL_THRESHOLD}
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollableTarget="social-scroll-wrapper"
        >
          <PostList>
            {feeds.map(({ platform, data }) => {
              if (platform === 'farcaster') {
                const key = Buffer.from(data.hash.data).toString('hex');
                return (
                  <FCast
                    key={key}
                    cast={data}
                    openFarcasterQR={openFarcasterQR}
                    farcasterUserData={{}}
                    farcasterUserDataObj={farcasterUserDataObj}
                    showMenuBtn
                    cardClickAction={(e) => {
                      if (channel?.channel_id)
                        setPostScroll({
                          currentParent: channel.channel_id,
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
