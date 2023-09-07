import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActiveProfile } from '@lens-protocol/react-web';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import InfiniteScroll from 'react-infinite-scroll-component';

import LensPostCard from '../components/social/lens/LensPostCard';
import FCast from '../components/social/farcaster/FCast';
import { useLoadTrendingFeeds } from '../hooks/useLoadTrendingFeeds';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import Loading from '../components/common/loading/Loading';
import { useLoadFollowingFeeds } from '../hooks/useLoadFollowingFeeds';
import useFarcasterCurrFid from '../hooks/farcaster/useFarcasterCurrFid';
import useLogin from '../hooks/useLogin';

enum FeedsType {
  FOLLOWING = 'following',
  TRENDING = 'trending',
}

export default function Home() {
  const { isLogin: isLoginU3 } = useLogin();

  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();
  const fid = useFarcasterCurrFid();

  const { address } = useAccount();
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

  const { openFarcasterQR, farcasterUserData } = useFarcasterCtx();

  const [searchParams] = useSearchParams();
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams]
  );

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);

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
        address,
        fid,
      });
    } else {
      loadTrendingFirstFeeds({
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
      });
    }
    return loadFollowingFirstFeeds;
  }, [
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    address,
    fid,
    feedsType,
  ]);

  const loadMoreFeeds = useCallback(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingMoreFeeds({
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        address,
        fid,
      });
    } else {
      loadTrendingMoreFeeds({
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
      });
    }
  }, [
    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    address,
    fid,
    feedsType,
  ]);

  useEffect(() => {
    if (address) {
      setFeedsType(FeedsType.FOLLOWING);
    } else {
      setFeedsType(FeedsType.TRENDING);
    }
  }, [address]);

  useEffect(() => {
    if (activeLensProfileLoading) return;
    loadFirstFeeds();
  }, [activeLensProfileLoading, loadFirstFeeds]);

  return (
    <HomeWrapper id="social-wrapper">
      <MainWrapper>
        {isLoginU3 && !!address && (
          <FeedsTypeTabsWrapper>
            <FeedsTypeTab
              active={feedsType === FeedsType.FOLLOWING}
              onClick={() => {
                setFeedsType(FeedsType.FOLLOWING);
                loadFirstFeeds();
              }}
            >
              Home
            </FeedsTypeTab>
            <FeedsTypeTab
              active={feedsType === FeedsType.TRENDING}
              onClick={() => {
                setFeedsType(FeedsType.TRENDING);
                loadFirstFeeds();
              }}
            >
              Trending
            </FeedsTypeTab>
          </FeedsTypeTabsWrapper>
        )}

        {firstLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <InfiniteScroll
            dataLength={feeds.length}
            next={() => {
              if (moreLoading) return;
              loadMoreFeeds();
            }}
            hasMore={!firstLoading && pageInfo.hasNextPage}
            loader={
              moreLoading ? (
                <LoadingMoreWrapper>
                  <Loading />
                </LoadingMoreWrapper>
              ) : null
            }
            scrollableTarget="social-wrapper"
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
        )}
      </MainWrapper>
      <SidebarWrapper>Comming soon</SidebarWrapper>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
  display: flex;
  gap: 40px;
  padding: 24px;
  margin-bottom: 20px;
`;
const MainWrapper = styled.div`
  width: 750px;
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
  background: #212228;
  overflow: hidden;
  & > *:not(:first-child) {
    border-top: 1px solid #191a1f;
  }
`;
const SidebarWrapper = styled.div`
  width: 0;
  flex: 1;
  height: 344px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #212228;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const FeedsTypeTabsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 10px;
`;
const FeedsTypeTab = styled.div<{ active: boolean }>`
  color: ${({ active }) => (active ? '#D6F16C' : '#9C9C9C')};
  font-family: Baloo Bhai 2;
  font-size: 20px;
  font-style: normal;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  line-height: 32px;
  cursor: pointer;
`;
