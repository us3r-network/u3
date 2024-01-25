import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import useChannelFeeds from 'src/hooks/social/useChannelFeeds';
import { resetFarcasterFollowingData } from 'src/hooks/social/farcaster/useFarcasterFollowing';
import { resetAllFollowingData } from 'src/hooks/social/useAllFollowing';
import { resetLensFollowingData } from 'src/hooks/social/lens/useLensFollowing';

import { MEDIA_BREAK_POINTS } from 'src/constants';
import AddPostMobile from 'src/components/social/AddPostMobile';
import SocialPageNav, {
  FeedsType,
  SocialBackNav,
} from '../../components/social/SocialPageNav';
import { SocialPlatform } from '../../services/social/types';
import SocialPlatformChoice from '../../components/social/SocialPlatformChoice';
import AddPost from '../../components/social/AddPost';
import SocialWhoToFollow from '../../components/social/SocialWhoToFollow';
import TrendChannel from '../../components/social/farcaster/TrendChannel';
import { LivepeerProvider } from '../../contexts/social/LivepeerCtx';
import { AllFirst } from './SocialAllFollowing';

export default function SocialLayoutContainer() {
  return (
    <LivepeerProvider>
      <SocialLayout />
    </LivepeerProvider>
  );
}
function SocialLayout() {
  const location = useLocation();
  const [postScroll, setPostScroll] = useState({
    currentParent: '',
    id: '',
    top: 0,
  });
  const { channelId } = useParams();

  const {
    feeds: channelFeeds,
    channel: currentChannel,
    firstLoading: channelFirstLoading,
    moreLoading: channelMoreLoading,
    loadMoreFeeds: loadChannelMoreFeeds,
    pageInfo: channelPageInfo,
    farcasterUserDataObj: channelFarcasterUserDataObj,
  } = useChannelFeeds();

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform | ''>('');

  useEffect(() => {
    return () => {
      resetFarcasterFollowingData();
      resetAllFollowingData();
      AllFirst.done = false;
      resetLensFollowingData();
    };
  }, []);

  const titleElem = useMemo(() => {
    if (location.pathname.includes('social/trends')) {
      return <SocialBackNav title="Topics" />;
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
          </LeftWrapper>
        )}

        <MainCenter id="main-center">
          <MainOutletWrapper>
            <Outlet
              context={{
                socialPlatform,
                feedsType,

                postScroll,
                setPostScroll,

                currentChannel,
                channelFeeds,
                channelPageInfo,
                channelFirstLoading,
                channelMoreLoading,
                loadChannelMoreFeeds,
                channelFarcasterUserDataObj,
              }}
            />
          </MainOutletWrapper>
        </MainCenter>

        {!isMobile && (
          <RightWrapper>
            {/* <SearchInput
              placeholder="Search"
              onlyOnKeyDown
              onSearch={onSearch}
            /> */}
            <div className="recommend">
              <SocialWhoToFollow />
              <TrendChannel />
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
  height: calc(100vh - 70px);
  overflow: scroll;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-bottom: 24px;
  box-sizing: border-box;
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
  top: 0px;
  padding: 24px 0;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
`;

const RightWrapper = styled(MainRight)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0px;
  padding: 24px 0;
  overflow: scroll;
  height: 100%;
  box-sizing: border-box;
  > .recommend {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;
