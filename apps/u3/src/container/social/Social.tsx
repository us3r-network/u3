import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { trim } from 'lodash';

import useListFeeds from 'src/hooks/social/useListFeeds';
import useListScroll from 'src/hooks/social/useListScroll';
import LensPostCard from '../../components/social/lens/LensPostCard';
import FCast from '../../components/social/farcaster/FCast';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import Loading from '../../components/common/loading/Loading';
import useFarcasterCurrFid from '../../hooks/social/farcaster/useFarcasterCurrFid';
import { FeedsType } from '../../components/social/SocialPageNav';

import AddPostForm from '../../components/social/AddPostForm';
import FollowingDefault from '../../components/social/FollowingDefault';
import useLogin from '../../hooks/shared/useLogin';
import {
  AddPostFormWrapper,
  LoadingMoreWrapper,
  LoadingWrapper,
  NoLoginStyled,
  PostList,
} from './CommonStyles';
import { useLensCtx } from '../../contexts/social/AppLensCtx';

export default function SocialAll() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [parentId, setParentId] = useState('social-all');
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const fid = useFarcasterCurrFid();
  const { ownedBy: lensProfileOwnedByAddress, id: lensSessionProfileId } =
    lensSessionProfile || {};

  const {
    socialPlatform,
    feedsType,

    loadTrendingFirstFeeds,
    loadTrendingMoreFeeds,

    loadFollowingFirstFeeds,
    loadFollowingMoreFeeds,

    setPostScroll,
  } = useOutletContext<any>(); // TODO: any type

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
    if (feedsType === FeedsType.FOLLOWING) {
      await loadFollowingFirstFeeds(parentId, {
        activeLensProfileId: lensSessionProfileId,
        keyword: currentSearchParams.keyword,
        address: lensProfileOwnedByAddress,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    } else {
      await loadTrendingFirstFeeds(parentId, {
        activeLensProfileId: lensSessionProfileId,
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
    lensSessionProfileId,
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
        activeLensProfileId: lensSessionProfileId,
        address: lensProfileOwnedByAddress,
        fid: isConnectedFarcaster ? fid : undefined,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    } else {
      await loadTrendingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        activeLensProfileId: lensSessionProfileId,
        platforms: socialPlatform ? [socialPlatform] : undefined,
      });
    }
  }, [
    parentId,
    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    lensSessionProfileId,
    currentSearchParams.keyword,
    lensProfileOwnedByAddress,
    fid,
    feedsType,
    socialPlatform,
    isConnectedFarcaster,
  ]);

  useEffect(() => {
    if (!mounted) return;
    if (!currentSearchParams.keyword || !trim(currentSearchParams.keyword))
      return;
    loadFirstFeeds();
  }, [currentSearchParams]);

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

const MainCenter = styled.div`
  width: 100%;
`;
