import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { FarcasterPageInfo, getFarcasterChannelFeeds } from 'src/api/farcaster';
import styled from 'styled-components';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import {
  LoadingMoreWrapper,
  LoadingWrapper,
} from 'src/components/profile/FollowListWidgets';
import { SocailPlatform } from 'src/api';
import { FeedsType } from 'src/components/social/SocialPageNav';
import FarcasterChannelData from 'src/constants/warpcast.json';
import { getSocialScrollWrapperId } from 'src/utils/social/keep-alive';
import AddPostForm from 'src/components/social/AddPostForm';
import { FEEDS_PAGE_SIZE } from 'src/api/feeds';

export default function SocialChannel() {
  const firstRef = useRef(false);
  const { channelName } = useParams();
  const [feeds, setFeeds] = useState([]);
  const [pageInfo, setPageInfo] = useState<FarcasterPageInfo>();
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[];
  }>({});
  const { openFarcasterQR } = useFarcasterCtx();
  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const { socialPlatform, feedsType } = useOutletContext<{
    socialPlatform: SocailPlatform | '';
    feedsType: FeedsType;
  }>();

  const channel = useMemo(() => {
    const channelData = FarcasterChannelData.find(
      (c) => c.name === channelName || c.channel_description === channelName
    );
    return channelData;
  }, [channelName]);

  const loadChannelCasts = useCallback(async () => {
    if (!channel) return;
    if (firstRef.current) return;
    firstRef.current = true;
    const resp = await getFarcasterChannelFeeds({
      channelName: channel.name || channel.channel_description,
      pageSize: FEEDS_PAGE_SIZE,
    });
    if (resp.data.code !== 0) {
      console.error('loadChannelCasts error');
      return;
    }

    setFeeds(resp.data.data.data);
    setPageInfo(resp.data.data.pageInfo);
    const temp: { [key: string]: { type: number; value: string }[] } = {};
    resp.data.data.farcasterUserData?.forEach((item) => {
      if (temp[item.fid]) {
        temp[item.fid].push(item);
      } else {
        temp[item.fid] = [item];
      }
    });
    setFarcasterUserData(temp);
  }, [channel, firstRef]);

  const loadMoreFeeds = useCallback(async () => {
    console.log('loadMoreFeeds');
    if (!channel) return;
    try {
      setMoreLoading(true);
      const resp = await getFarcasterChannelFeeds({
        channelName: channel.name || channel.channel_description,
        pageSize: FEEDS_PAGE_SIZE,
        endFarcasterCursor: pageInfo?.endFarcasterCursor,
      });
      if (resp.data.code !== 0) {
        console.error('loadChannelCasts error');
        return;
      }
      setFeeds((prev) => [...prev, ...resp.data.data.data]);
      setPageInfo(resp.data.data.pageInfo);
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      resp.data.data.farcasterUserData?.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterUserData((pre) => ({ ...pre, ...temp }));
    } catch (error) {
      console.error(error);
    } finally {
      setMoreLoading(false);
    }
  }, [pageInfo]);

  useEffect(() => {
    setFirstLoading(true);
    loadChannelCasts()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setFirstLoading(false);
      });
    return () => {
      firstRef.current = false;
    };
  }, [loadChannelCasts]);

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
          dataLength={feeds.length}
          next={() => {
            if (moreLoading) return;
            loadMoreFeeds();
          }}
          hasMore={pageInfo?.hasNextPage || false}
          scrollThreshold="1000px"
          loader={
            moreLoading ? (
              <LoadingMoreWrapper>
                <Loading />
              </LoadingMoreWrapper>
            ) : null
          }
          scrollableTarget={getSocialScrollWrapperId(feedsType, socialPlatform)}
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
