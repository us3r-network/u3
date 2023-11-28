import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { useLoadTrendingFeeds } from 'src/hooks/social/useLoadTrendingFeeds';
import { useLoadFollowingFeeds } from 'src/hooks/social/useLoadFollowingFeeds';
import PinedChannels from 'src/components/social/PinedChannels';
import useChannelFeeds from 'src/hooks/social/useChannelFeeds';
import useFarcasterTrending from 'src/hooks/social/farcaster/useFarcasterTrending';
import useFarcasterFollowing from 'src/hooks/social/farcaster/useFarcasterFollowing';
import useLensTrending from 'src/hooks/social/lens/useLensTrending';

import { useSession } from '@lens-protocol/react-web';
import { MEDIA_BREAK_POINTS } from 'src/constants';
import SocialPageNav, {
  FeedsType,
  SocialBackNav,
} from '../../components/social/SocialPageNav';
import { SocialPlatform } from '../../services/social/types';
import SocialPlatformChoice from '../../components/social/SocialPlatformChoice';
import AddPost from '../../components/social/AddPost';
import SocialWhoToFollow from '../../components/social/SocialWhoToFollow';
import SearchInput from '../../components/common/input/SearchInput';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import TrendChannel from '../../components/social/farcaster/TrendChannel';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import { getOwnedByAddress } from '../../utils/social/lens/profile';
import { LivepeerProvider } from '../../contexts/social/LivepeerCtx';

export default function SocialLayoutContainer() {
  return (
    <LivepeerProvider>
      <SocialLayout />
    </LivepeerProvider>
  );
}
function SocialLayout() {
  const location = useLocation();
  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { loading: lensSessionLoading } = useSession();
  const lensProfileOwnedByAddress = getOwnedByAddress(lensSessionProfile);

  const [postScroll, setPostScroll] = useState({
    currentParent: '',
    id: '',
    top: 0,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { channelId } = useParams();

  const {
    loading: farcasterTrendingLoading,
    loadFarcasterTrending,
    farcasterTrendingUserData,
    farcasterTrending,
    pageInfo: farcasterTrendingPageInfo,
  } = useFarcasterTrending();

  const {
    farcasterFollowing,
    farcasterFollowingUserData,
    loadFarcasterFollowing,
    loading: farcasterFollowingLoading,
    pageInfo: farcasterFollowingPageInfo,
  } = useFarcasterFollowing();

  const { loadLensTrending } = useLensTrending();

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

  const {
    feeds: channelFeeds,
    channel: currentChannel,
    firstLoading: channelFirstLoading,
    moreLoading: channelMoreLoading,
    loadMoreFeeds: loadChannelMoreFeeds,
    pageInfo: channelPageInfo,
    farcasterUserData: channelFarcasterUserData,
  } = useChannelFeeds();

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform | ''>('');

  const onSearch = useCallback(
    (value: string) => {
      if (value) {
        searchParams.set('keyword', value);
      } else {
        searchParams.delete('keyword');
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const switchedFeedsTypeFirst = useRef(false);
  useEffect(() => {
    if (!switchedFeedsTypeFirst.current) {
      if (!isConnectedFarcaster && !lensProfileOwnedByAddress) {
        setFeedsType(FeedsType.TRENDING);
      } else {
        setFeedsType(FeedsType.FOLLOWING);
      }
    }
    if (!lensSessionLoading) {
      switchedFeedsTypeFirst.current = true;
    }
  }, [isConnectedFarcaster, lensProfileOwnedByAddress, lensSessionLoading]);

  const titleElem = useMemo(() => {
    if (location.pathname.includes('social/trends')) {
      return <SocialBackNav title="Trends" />;
    }
    if (location.pathname.includes('social/channel') && channelId) {
      return <SocialBackNav isChannel channelId={channelId} />;
    }
    if (location.pathname.includes('post-detail')) {
      return <SocialBackNav />;
    }
    if (location.pathname.includes('suggest-follow')) {
      return <SocialBackNav title="Suggest Profiles" />;
    }
    return (
      <SocialPageNav
        showFeedsTabs
        feedsType={feedsType}
        onChangeFeedsType={(type) => {
          setFeedsType(type);
        }}
      />
    );
  }, [location.pathname, feedsType, socialPlatform, channelId]);

  return (
    <HomeWrapper id="social-wrapper">
      <HeaderWrapper>{titleElem}</HeaderWrapper>
      <MainWrapper id="social-scroll-wrapper">
        {!isMobile && (
          <LeftWrapper>
            <SocialPlatformChoice />
            <AddPost />
            <PinedChannels />
          </LeftWrapper>
        )}

        <MainCenter id="main-center">
          <MainOutletWrapper>
            <Outlet
              context={{
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

                // farcasterScrollTop,
                // setFarcasterScrollTop,
                postScroll,
                setPostScroll,

                currentChannel,
                channelFeeds,
                channelPageInfo,
                channelFirstLoading,
                channelMoreLoading,
                loadChannelMoreFeeds,
                channelFarcasterUserData,

                farcasterTrendingLoading,
                loadFarcasterTrending,
                farcasterTrending,
                farcasterTrendingUserData,
                farcasterTrendingPageInfo,

                farcasterFollowingLoading,
                loadFarcasterFollowing,
                farcasterFollowing,
                farcasterFollowingUserData,
                farcasterFollowingPageInfo,

                loadLensTrending,
              }}
            />
          </MainOutletWrapper>
        </MainCenter>

        {!isMobile && (
          <RightWrapper>
            <SearchInput
              placeholder="Search"
              onlyOnKeyDown
              onSearch={onSearch}
            />
            <div className="recommend">
              <SocialWhoToFollow />
              <TrendChannel />
              <br />
            </div>
          </RightWrapper>
        )}
      </MainWrapper>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0px 24px;
  box-sizing: border-box;
  position: relative;
  ${isMobile &&
  `
  height: 100vh;
  padding: 10px;
  padding-bottom: 60px;
  `}

  .ka-wrapper {
    width: 100%;
    height: calc(100% - 96px);
  }
  .ka-content {
    width: 100%;
    height: 100%;
  }
`;
const MainWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 96px);
  overflow: scroll;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 40px;
`;
export const HeaderWrapper = styled.div`
  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc(${MEDIA_BREAK_POINTS.xxxl}px - 60px - 40px);
  }
  /* height: 100%; */
  margin: 0 auto;
`;

const MainLeft = styled.div`
  width: 302px;
`;
const MainRight = styled.div`
  width: 350px;
`;
const MainCenter = styled.div`
  width: 600px;
  margin-top: 20px;
  box-sizing: border-box;
  height: fit-content;
`;
const MainOutletWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const LeftWrapper = styled(MainLeft)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 24px;
  height: calc(100vh - 96px - 40px);
  overflow: scroll;
`;

const RightWrapper = styled(MainRight)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 24px;
  overflow: scroll;
  height: calc(100vh - 96px - 40px);
  > .recommend {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;
