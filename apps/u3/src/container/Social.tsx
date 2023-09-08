import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActiveProfile } from '@lens-protocol/react-web';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import InfiniteScroll from 'react-infinite-scroll-component';

import { isMobile } from 'react-device-detect';
import LensPostCard from '../components/social/lens/LensPostCard';
import FCast from '../components/social/farcaster/FCast';
import { useLoadTrendingFeeds } from '../hooks/useLoadTrendingFeeds';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import Loading from '../components/common/loading/Loading';
import { useLoadFollowingFeeds } from '../hooks/useLoadFollowingFeeds';
import useFarcasterCurrFid from '../hooks/farcaster/useFarcasterCurrFid';
import useLogin from '../hooks/useLogin';
import SocialPageNav, { FeedsType } from '../components/social/SocialPageNav';
import { SocailPlatform } from '../api';
import SocialPlatformChoice from '../components/social/SocialPlatformChoice';
import AddPost from '../components/social/AddPost';
import SocialWhoToFollow from '../components/social/SocialWhoToFollow';
import SearchInput from '../components/common/input/SearchInput';

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

  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams]
  );
  const onSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams();
      params.append('keyword', value);
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocailPlatform | ''>('');

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
    address,
    fid,
    feedsType,
    socialPlatform,
  ]);

  const loadMoreFeeds = useCallback(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingMoreFeeds({
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        address,
        fid,
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
    address,
    fid,
    feedsType,
    socialPlatform,
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
      <SocialPageNav
        showFeedsTabs={isLoginU3 && !!address}
        feedsType={feedsType}
        onChangeFeedsType={(type) => {
          setFeedsType(type);
          loadFirstFeeds();
        }}
      />
      <MainWrapper>
        {!isMobile && (
          <MainLeft>
            <SocialPlatformChoice
              platform={socialPlatform}
              onChangePlatform={setSocialPlatform}
            />
            <AddPost />
          </MainLeft>
        )}

        <MainCenter>
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
        </MainCenter>
        {!isMobile && (
          <MainRight>
            <SearchInput placeholder="Search" onSearch={onSearch} />
            <SocialWhoToFollow />
          </MainRight>
        )}
      </MainWrapper>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
  padding: 24px;
  margin-bottom: 20px;
  ${isMobile &&
  `
  height: 100vh;
  padding: 10px;
  padding-bottom: 60px;
  `}
`;
const MainWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 40px;
`;
const MainLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const MainCenter = styled.div`
  width: 600px;
`;
const MainRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
