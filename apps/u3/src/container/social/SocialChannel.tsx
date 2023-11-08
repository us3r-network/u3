import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import styled from 'styled-components';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import {
  LoadingMoreWrapper,
  LoadingWrapper,
} from 'src/components/profile/FollowListWidgets';
import AddPostForm from 'src/components/social/AddPostForm';

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
    channelFarcasterUserData: farcasterUserData,

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
      <AddPostFormWrapper>
        <AddPostForm channel={channel} />
      </AddPostFormWrapper>

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
          scrollThreshold="1000px"
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
                    farcasterUserData={farcasterUserData}
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

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  background: #212228;
  overflow: hidden;
  & > * {
    border-top: 1px solid #718096;
  }
`;

const AddPostFormWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;
