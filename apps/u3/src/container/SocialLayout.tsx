import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import { useActiveProfile } from '@lens-protocol/react-web';
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

export default function Home() {
  const location = useLocation();
  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();
  const { ownedBy: lensProfileOwnedByAddress } = activeLensProfile || {};

  const [, setSearchParams] = useSearchParams();

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

  const titleElem = location.pathname.includes('post-detail') ? (
    <SocialBackNav />
  ) : (
    <SocialPageNav
      showFeedsTabs
      feedsType={feedsType}
      onChangeFeedsType={(type) => {
        setFeedsType(type);
      }}
    />
  );

  return (
    <HomeWrapper id="social-wrapper">
      {!isMobile && <div className="op" />}
      {titleElem}
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

        {(!isMobile && (
          <div className="outlet-op">
            <Outlet context={{ socialPlatform, feedsType }} />
          </div>
        )) || <Outlet context={{ socialPlatform, feedsType }} />}

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
  padding-top: 0;
  margin-bottom: 20px;
  ${isMobile &&
  `
  height: 100vh;
  padding: 10px;
  padding-bottom: 60px;
  `}

  > .op {
    height: 24px;
    z-index: 10;
    background: #14171a;
    position: sticky;
    top: 0;
  }
  .outlet-op {
    width: 600px;
  }
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
  position: sticky;
  top: 116px;
  height: fit-content;
`;

const MainRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 116px;
  height: fit-content;
`;
