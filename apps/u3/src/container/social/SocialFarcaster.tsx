import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { trim } from 'lodash';

import AddPostForm from 'src/components/social/AddPostForm';
import useFarcasterCurrFid from 'src/hooks/social/farcaster/useFarcasterCurrFid';
import { FeedsType } from 'src/components/social/SocialPageNav';
import { SocialPlatform } from 'src/services/social/types';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';
import useLogin from 'src/hooks/shared/useLogin';
import NoLogin from 'src/components/layout/NoLogin';
import FollowingDefault from 'src/components/social/FollowingDefault';
import useListScroll from 'src/hooks/social/useListScroll';
import useListFeeds from 'src/hooks/social/useListFeeds';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';

export default function SocialFarcaster() {
  const {
    feedsType,

    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,

    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,

    setPostScroll,

    farcasterTrendingPageInfo,
    farcasterTrendingLoading,
    loadFarcasterTrending,
    farcasterTrending,
    farcasterTrendingUserData,
  } = useOutletContext<any>(); // TODO: any

  const [parentId] = useState('social-farcaster');

  const fid = useFarcasterCurrFid();
  const {
    isConnected: isConnectedFarcaster,
    openFarcasterQR,
    farcasterUserData,
  } = useFarcasterCtx();
  const { isLogin } = useLogin();

  const { mounted, setFirstLoadingDone } = useListScroll(parentId);
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
      const fidParam = isConnectedFarcaster ? fid : undefined;
      if (!fidParam) {
        setFirstLoadingDone(true);
        return;
      }
      await loadFollowingFirstFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        fid: fidParam,
        platforms: SocialPlatform.Farcaster,
      });
    } else {
      await loadFarcasterTrending();
    }
    setFirstLoadingDone(true);
  }, [
    parentId,
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    currentSearchParams.keyword,
    fid,
    feedsType,
    isConnectedFarcaster,
  ]);

  const loadMoreFeeds = useCallback(async () => {
    console.log('loadMoreFeeds', Date.now());
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: SocialPlatform.Farcaster,
      });
    } else {
      await loadFarcasterTrending();
    }
  }, [
    parentId,
    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    currentSearchParams.keyword,
    fid,
    feedsType,
    isConnectedFarcaster,
  ]);

  useEffect(() => {
    if (!mounted) return;
    if (!currentSearchParams.keyword || !trim(currentSearchParams.keyword))
      return;
    loadFirstFeeds();
  }, [currentSearchParams]);

  useEffect(() => {
    if (!mounted) return;
    if (feedsType === FeedsType.FOLLOWING) {
      if (feeds.length > 0) return;
    } else if (farcasterTrending.length > 0) return;

    loadFirstFeeds();
  }, [loadFirstFeeds, feeds, mounted, feedsType]);

  const displayFeeds = useMemo(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      return feeds;
    }
    return farcasterTrending;
  }, [feedsType, farcasterTrending, feeds]);

  const displayUserData = useMemo(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      return farcasterUserData;
    }
    return farcasterTrendingUserData;
  }, [feedsType, farcasterTrendingUserData, farcasterUserData]);

  const displayPageInfo = useMemo(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      return pageInfo;
    }
    return farcasterTrendingPageInfo;
  }, [feedsType, pageInfo, farcasterTrendingPageInfo]);

  const hasMore =
    displayPageInfo?.hasNextPage !== undefined
      ? displayPageInfo?.hasNextPage
      : true;

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!isConnectedFarcaster) {
      return (
        <MainCenter>
          <FollowingDefault farcaster />
        </MainCenter>
      );
    }
  }

  return (
    <FarcasterListBox>
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>

      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={displayFeeds.length}
        next={() => {
          if (feedsType === FeedsType.FOLLOWING) {
            if (moreLoading) return;
            loadMoreFeeds();
          } else {
            if (farcasterTrendingLoading) return;
            loadMoreFeeds();
          }
        }}
        hasMore={hasMore || firstLoading}
        loader={
          <LoadingMoreWrapper>
            <Loading />
          </LoadingMoreWrapper>
        }
        scrollThreshold={FEEDS_SCROLL_THRESHOLD}
        scrollableTarget="social-scroll-wrapper"
      >
        <PostList>
          {displayFeeds.map(({ platform, data }) => {
            if (platform === 'farcaster') {
              const key = Buffer.from(data.hash.data).toString('hex');
              return (
                <FCast
                  key={key}
                  cast={data}
                  openFarcasterQR={openFarcasterQR}
                  farcasterUserData={displayUserData}
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
    </FarcasterListBox>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;

const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;

const FarcasterListBox = styled.div``;

const AddPostFormWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
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
