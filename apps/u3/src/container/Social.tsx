import styled from 'styled-components';
import { useCallback, useEffect, useMemo } from 'react';
import { useActiveProfile } from '@lens-protocol/react-web';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import LensPostCard from '../components/social/lens/LensPostCard';
import FCast from '../components/social/farcaster/FCast';
import { useLoadTrendingFeeds } from '../hooks/useLoadTrendingFeeds';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import Loading from '../components/common/loading/Loading';
import { useLoadFollowingFeeds } from '../hooks/useLoadFollowingFeeds';
import useFarcasterCurrFid from '../hooks/farcaster/useFarcasterCurrFid';
import { FeedsType } from '../components/social/SocialPageNav';
import { SocailPlatform } from '../api';
import AddPostForm from '../components/social/AddPostForm';
import FollowingDefault from '../components/social/FollowingDefault';
import { getSocialScrollWrapperId } from '../utils/social/keep-alive';

export default function Home() {
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();
  const fid = useFarcasterCurrFid();
  const { ownedBy: lensProfileOwnedByAddress } = activeLensProfile || {};
  const {
    firstLoading: trendingFirstLoading,
    moreLoading: trendingMoreLoading,
    feeds: trendingFeeds,
    pageInfo: trendingPageInfo,
    loadFirstFeeds: loadTrendingFirstFeeds,
    loadMoreFeeds: loadTrendingMoreFeeds,
  } = useLoadTrendingFeeds();

  const {
    firstLoading: followingFirstLoading,
    moreLoading: followingMoreLoading,
    feeds: followingFeeds,
    pageInfo: followingPageInfo,
    loadFirstFeeds: loadFollowingFirstFeeds,
    loadMoreFeeds: loadFollowingMoreFeeds,
  } = useLoadFollowingFeeds();
  const { socialPlatform, feedsType } = useOutletContext<{
    socialPlatform: SocailPlatform | '';
    feedsType: FeedsType;
  }>();
  const {
    openFarcasterQR,
    farcasterUserData,
    isConnected: isConnectedFarcaster,
  } = useFarcasterCtx();

  const [searchParams] = useSearchParams();
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams]
  );

  const firstLoading = useMemo(
    () =>
      feedsType === FeedsType.TRENDING
        ? trendingFirstLoading
        : followingFirstLoading,
    [feedsType, trendingFirstLoading, followingFirstLoading]
  );

  const moreLoading = useMemo(
    () =>
      feedsType === FeedsType.TRENDING
        ? trendingMoreLoading
        : followingMoreLoading,
    [feedsType, trendingMoreLoading, followingMoreLoading]
  );

  const feeds = useMemo(
    () => (feedsType === FeedsType.TRENDING ? trendingFeeds : followingFeeds),
    [feedsType, trendingFeeds, followingFeeds]
  );

  const pageInfo = useMemo(
    () =>
      feedsType === FeedsType.TRENDING ? trendingPageInfo : followingPageInfo,
    [feedsType, trendingPageInfo, followingPageInfo]
  );

  const loadFirstFeeds = useCallback(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingFirstFeeds({
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
        address: lensProfileOwnedByAddress,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    } else {
      loadTrendingFirstFeeds({
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    }
    return loadFollowingFirstFeeds;
  }, [
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    lensProfileOwnedByAddress,
    fid,
    feedsType,
    socialPlatform,
    isConnectedFarcaster,
  ]);

  const loadMoreFeeds = useCallback(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingMoreFeeds({
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        address: lensProfileOwnedByAddress,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    } else {
      loadTrendingMoreFeeds({
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    }
  }, [
    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    lensProfileOwnedByAddress,
    fid,
    feedsType,
    socialPlatform,
    isConnectedFarcaster,
  ]);

  useEffect(() => {
    if (activeLensProfileLoading) return;
    loadFirstFeeds();
  }, [activeLensProfileLoading, loadFirstFeeds]);

  if (
    feedsType === FeedsType.FOLLOWING &&
    !isConnectedFarcaster &&
    !lensProfileOwnedByAddress
  ) {
    return (
      <MainCenter>
        <FollowingDefault />
      </MainCenter>
    );
  }
  return (
    <MainCenter>
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>

      {(() => {
        if (firstLoading) {
          return (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          );
        }
        return (
          <InfiniteScroll
            dataLength={feeds.length}
            next={() => {
              if (moreLoading) return;
              loadMoreFeeds();
            }}
            hasMore={!firstLoading && pageInfo.hasNextPage}
            scrollThreshold="1000px"
            loader={
              moreLoading ? (
                <LoadingMoreWrapper>
                  <Loading />
                </LoadingMoreWrapper>
              ) : null
            }
            scrollableTarget={getSocialScrollWrapperId(
              feedsType,
              socialPlatform
            )}
          >
            <PostList>
              {feeds.map(({ platform, data }) => {
                if (platform === 'lens') {
                  return <LensPostCard key={data.id} data={data} />;
                }
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
        );
      })()}
    </MainCenter>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
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
