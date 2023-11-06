import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActiveProfile } from '@lens-protocol/react-web';

import AddPostForm from 'src/components/social/AddPostForm';
import useFarcasterCurrFid from 'src/hooks/social/farcaster/useFarcasterCurrFid';
import { FeedsType } from 'src/components/social/SocialPageNav';
import { SocialPlatform } from 'src/services/social/types';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';
import { FeedsDataItem } from 'src/services/social/api/feeds';
import useLogin from 'src/hooks/shared/useLogin';
import NoLogin from 'src/components/layout/NoLogin';
import FollowingDefault from 'src/components/social/FollowingDefault';
import useListScroll from 'src/hooks/social/useListScroll';
import useListFeeds from 'src/hooks/social/useListFeeds';

export default function SocialFarcaster() {
  const {
    trendingFeeds,
    followingFeeds,
    feedsType,

    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    followingFirstLoading,
    followingPageInfo,
    followingMoreLoading,

    trendingMoreLoading,
    trendingPageInfo,
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    trendingFirstLoading,

    postScroll,
    setPostScroll,
  } = useOutletContext<any>(); // TODO: any

  const [parentId] = useState('social-farcaster');

  const fid = useFarcasterCurrFid();
  const {
    isConnected: isConnectedFarcaster,
    openFarcasterQR,
    farcasterUserData,
  } = useFarcasterCtx();
  const { isLogin } = useLogin();

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
        keyword: currentSearchParams.keyword,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: SocialPlatform.Farcaster,
      });
    } else {
      await loadTrendingFirstFeeds(parentId, {
        activeLensProfileId: undefined,
        keyword: currentSearchParams.keyword,
        platforms: SocialPlatform.Farcaster,
      });
    }
    setFirstLoadingDone(true);
    return loadFollowingFirstFeeds;
  }, [
    parentId,
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    currentSearchParams.keyword,
    fid,
    feedsType,
    isConnectedFarcaster,
  ]);

  const loadMoreFeeds = useCallback(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: SocialPlatform.Farcaster,
      });
    } else {
      loadTrendingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        platforms: SocialPlatform.Farcaster,
      });
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
    if (firstLoadingDone) return;
    if (feeds.length > 0) return;
    if (!mounted) return;

    loadFirstFeeds();
  }, [loadFirstFeeds, feeds, mounted, firstLoadingDone]);

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
          hasMore={!firstLoading && pageInfo?.hasNextPage}
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollThreshold="1000px"
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
