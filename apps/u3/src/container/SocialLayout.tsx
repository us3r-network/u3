import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import { useActiveProfile } from '@lens-protocol/react-web';
import KeepAlive from 'react-activation';
import SocialPageNav, {
  FeedsType,
  SocialBackNav,
} from '../components/social/SocialPageNav';
import { SocailPlatform } from '../api';
import SocialPlatformChoice from '../components/social/SocialPlatformChoice';
import AddPost from '../components/social/AddPost';
import SocialWhoToFollow from '../components/social/SocialWhoToFollow';
import SearchInput from '../components/common/input/SearchInput';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import { getSocialScrollWrapperId } from '../utils/social/keep-alive';
import TrendChannel from '../components/social/farcaster/TrendChannel';

export default function Home() {
  const location = useLocation();
  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();
  const { ownedBy: lensProfileOwnedByAddress } = activeLensProfile || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const { channelName } = useParams();

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

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocailPlatform | ''>('');

  const switchedFeedsTypeFirst = useRef(false);
  useEffect(() => {
    if (!switchedFeedsTypeFirst.current) {
      if (!isConnectedFarcaster && !lensProfileOwnedByAddress) {
        setFeedsType(FeedsType.TRENDING);
      } else {
        setFeedsType(FeedsType.FOLLOWING);
      }
    }
    if (!activeLensProfileLoading) {
      switchedFeedsTypeFirst.current = true;
    }
  }, [
    isConnectedFarcaster,
    lensProfileOwnedByAddress,
    activeLensProfileLoading,
  ]);

  const titleElem = useMemo(() => {
    if (location.pathname.includes('social/channel') && channelName) {
      return <SocialBackNav title={channelName} />;
    }
    if (location.pathname.includes('post-detail')) {
      return <SocialBackNav />;
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
  }, [location.pathname, feedsType, socialPlatform, channelName]);

  const keepAliveSocialOutlet = useMemo(() => {
    const socialCacheKey = getSocialScrollWrapperId(feedsType, socialPlatform);
    return (
      <KeepAlive cacheKey={socialCacheKey}>
        <MainWrapper id={socialCacheKey}>
          {!isMobile && <MainLeft />}
          <MainCenter>
            <MainOutletWrapper>
              <Outlet context={{ socialPlatform, feedsType }} />
            </MainOutletWrapper>
          </MainCenter>
          {!isMobile && <MainRight />}
        </MainWrapper>
      </KeepAlive>
    );
  }, [socialPlatform, feedsType]);

  const PostDetailOutlet = useMemo(() => {
    return (
      <DetailMainWrapper>
        <MainWrapper>
          <MainLeft />
          <MainCenter>
            <MainOutletWrapper>
              <Outlet context={{ socialPlatform, feedsType }} />
            </MainOutletWrapper>
          </MainCenter>
          <MainRight />
        </MainWrapper>
      </DetailMainWrapper>
    );
  }, [socialPlatform, feedsType]);
  const isPostDetail = location.pathname.includes('post-detail');
  return (
    <HomeWrapper id="social-wrapper">
      {titleElem}
      {!isMobile && (
        <LeftWrapper>
          <SocialPlatformChoice
            platform={socialPlatform}
            onChangePlatform={setSocialPlatform}
          />
          <AddPost />
        </LeftWrapper>
      )}

      {isPostDetail ? PostDetailOutlet : keepAliveSocialOutlet}

      {!isMobile && (
        <RightWrapper>
          <SearchInput placeholder="Search" onlyOnKeyDown onSearch={onSearch} />
          <div className="recommend">
            <SocialWhoToFollow />
            <TrendChannel />
            <br />
          </div>
        </RightWrapper>
      )}
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
const DetailMainWrapper = styled.div`
  width: 100%;
  height: calc(100% - 96px);
  padding-bottom: 20px;
  box-sizing: border-box;
`;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  gap: 40px;
`;
const MainLeft = styled.div`
  width: 302px;
`;
const MainRight = styled.div`
  width: 350px;
`;
const MainCenter = styled.div`
  width: 600px;
  padding: 20px 0px;
  box-sizing: border-box;
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
  position: absolute;
  top: 116px;
  height: fit-content;
`;

const RightWrapper = styled(MainRight)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  top: 116px;
  right: 24px;
  height: fit-content;

  > .recommend {
    overflow: scroll;
    height: calc(100vh - 96px - 40px - 40px);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;
