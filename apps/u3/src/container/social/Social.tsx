import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useActiveProfile } from '@lens-protocol/react-web';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import useListFeeds from 'src/hooks/social/useListFeeds';
import useListScroll from 'src/hooks/social/useListScroll';
import LensPostCard from '../../components/social/lens/LensPostCard';
import FCast from '../../components/social/farcaster/FCast';
import { useLoadTrendingFeeds } from '../../hooks/social/useLoadTrendingFeeds';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import Loading from '../../components/common/loading/Loading';
import { useLoadFollowingFeeds } from '../../hooks/social/useLoadFollowingFeeds';
import useFarcasterCurrFid from '../../hooks/social/farcaster/useFarcasterCurrFid';
import { FeedsType } from '../../components/social/SocialPageNav';

import AddPostForm from '../../components/social/AddPostForm';
import FollowingDefault from '../../components/social/FollowingDefault';
import useLogin from '../../hooks/shared/useLogin';
import NoLogin from '../../components/layout/NoLogin';

export default function SocialAll() {
  const [parentId, setParentId] = useState('social-all');
  const { isLogin } = useLogin();
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();
  const fid = useFarcasterCurrFid();
  const { ownedBy: lensProfileOwnedByAddress } = activeLensProfile || {};

  const {
    socialPlatform,
    feedsType,

    trendingFirstLoading,
    trendingMoreLoading,
    trendingFeeds,
    trendingPageInfo,
    loadTrendingFirstFeeds,
    loadTrendingMoreFeeds,

    followingFirstLoading,
    followingMoreLoading,
    followingFeeds,
    followingPageInfo,
    loadFollowingFirstFeeds,
    loadFollowingMoreFeeds,

    postScroll,
    setPostScroll,
  } = useOutletContext<any>();

  const {
    openFarcasterQR,
    farcasterUserData,
    isConnected: isConnectedFarcaster,
  } = useFarcasterCtx();

  const { mounted, firstLoadingDone, setFirstLoadingDone } =
    useListScroll(parentId);
  const { feeds, firstLoading, pageInfo, moreLoading } = useListFeeds(parentId);

  const [searchParams] = useSearchParams();
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams]
  );

  const loadFirstFeeds = useCallback(async () => {
    setFirstLoadingDone(false);
    if (feedsType === FeedsType.FOLLOWING) {
      await loadFollowingFirstFeeds(parentId, {
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
        address: lensProfileOwnedByAddress,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    } else {
      await loadTrendingFirstFeeds(parentId, {
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    }
    setFirstLoadingDone(true);
    return loadFollowingFirstFeeds;
  }, [
    parentId,
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

  const loadMoreFeeds = useCallback(async () => {
    if (feedsType === FeedsType.FOLLOWING) {
      await loadFollowingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        address: lensProfileOwnedByAddress,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    } else {
      await loadTrendingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    }
  }, [
    parentId,
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
    if (firstLoadingDone) return;
    if (feeds.length > 0) return;
    if (!mounted) return;

    loadFirstFeeds();
  }, [loadFirstFeeds, feeds, mounted, firstLoadingDone]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!isConnectedFarcaster && !lensProfileOwnedByAddress) {
      return (
        <MainCenter>
          <FollowingDefault farcaster lens />
        </MainCenter>
      );
    }
  }

  return (
    <MainCenter>
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>

      {(firstLoading && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )) || (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={feeds?.length || 0}
          next={() => {
            console.log({ moreLoading });
            if (moreLoading) return;
            loadMoreFeeds();
          }}
          hasMore={!firstLoading && pageInfo?.hasNextPage}
          scrollThreshold="1000px"
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollableTarget="social-scroll-wrapper"
        >
          <PostList>
            {(feeds || []).map(({ platform, data }) => {
              if (platform === 'lens') {
                return (
                  <LensPostCard
                    key={data.id}
                    data={data}
                    cardClickAction={(e) => {
                      setPostScroll({
                        currentParent: parentId,
                        id: data.id,
                        top: (e.target as HTMLDivElement).offsetTop,
                      });
                    }}
                  />
                );
              }
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
                      setPostScroll({
                        currentParent: parentId,
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
    </MainCenter>
  );
}
const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;
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
