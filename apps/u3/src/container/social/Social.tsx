import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext, useSearchParams } from 'react-router-dom';
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
import { FEEDS_SCROLL_THRESHOLD } from '../../services/social/api/feeds';

export default function SocialAll() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [parentId, setParentId] = useState('social-all');
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const fid = useFarcasterCurrFid();
  const { id: lensSessionProfileId } = lensSessionProfile || {};

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

  const { mounted, setFirstLoadingDone } = useListScroll(parentId);
  const { feeds, firstLoading, pageInfo, moreLoading } = useListFeeds(parentId);

  const [searchParams] = useSearchParams();

  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams]
  );

  // const loadFirstFeeds = useCallback(async () => {
  //   setFirstLoadingDone(false);
  //   if (feedsType === FeedsType.FOLLOWING) {
  //     const fidParam = isConnectedFarcaster ? fid : undefined;
  //     const lensSessionProfileIdParam = lensSessionProfileId;
  //     if (!fidParam && !lensSessionProfileIdParam) {
  //       setFirstLoadingDone(true);
  //       return;
  //     }

  //     await loadFollowingFirstFeeds(parentId, {
  //       keyword: currentSearchParams.keyword,
  //       fid: fidParam,
  //       lensProfileId: lensSessionProfileIdParam,
  //       platforms: socialPlatform ? [socialPlatform] : undefined,
  //     });
  //   } else {
  //     await loadTrendingFirstFeeds(parentId, {
  //       keyword: currentSearchParams.keyword,
  //       platforms: socialPlatform ? [socialPlatform] : undefined,
  //     });
  //   }
  //   setFirstLoadingDone(true);
  // }, [
  //   parentId,
  //   loadFollowingFirstFeeds,
  //   loadTrendingFirstFeeds,
  //   currentSearchParams.keyword,
  //   fid,
  //   feedsType,
  //   socialPlatform,
  //   isConnectedFarcaster,
  //   lensSessionProfileId,
  // ]);

  // const loadMoreFeeds = useCallback(async () => {
  //   if (feedsType === FeedsType.FOLLOWING) {
  //     await loadFollowingMoreFeeds(parentId, {
  //       keyword: currentSearchParams.keyword,
  //       lensProfileId: lensSessionProfileId,
  //       fid: isConnectedFarcaster ? fid : undefined,
  //       platforms: socialPlatform ? [socialPlatform] : undefined,
  //     });
  //   } else {
  //     await loadTrendingMoreFeeds(parentId, {
  //       keyword: currentSearchParams.keyword,
  //       platforms: socialPlatform ? [socialPlatform] : undefined,
  //     });
  //   }
  // }, [
  //   parentId,
  //   loadFollowingMoreFeeds,
  //   loadTrendingMoreFeeds,
  //   currentSearchParams.keyword,
  //   fid,
  //   feedsType,
  //   socialPlatform,
  //   isConnectedFarcaster,
  //   lensSessionProfileId,
  // ]);

  // useEffect(() => {
  //   if (!mounted) return;
  //   if (!currentSearchParams.keyword || !trim(currentSearchParams.keyword))
  //     return;
  //   loadFirstFeeds();
  // }, [currentSearchParams]);

  // useEffect(() => {
  //   // if (firstLoadingDone) return;
  //   if (feeds.length > 0) return;
  //   if (!mounted) return;

  //   loadFirstFeeds();
  // }, [loadFirstFeeds, feeds, mounted]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!isConnectedFarcaster && !lensSessionProfileId) {
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
      <Outlet />
    </MainCenter>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;
