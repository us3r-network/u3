import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { isMobile } from 'react-device-detect';

import useLogin from '../hooks/useLogin';
import SocialPageNav, {
  FeedsType,
  SocialBackNav,
} from '../components/social/SocialPageNav';
import { SocailPlatform } from '../api';
import SocialPlatformChoice from '../components/social/SocialPlatformChoice';
import AddPost from '../components/social/AddPost';
import SocialWhoToFollow from '../components/social/SocialWhoToFollow';
import SearchInput from '../components/common/input/SearchInput';
import ModalImg from '../components/social/ModalImg';

export default function Home() {
  const { isLogin: isLoginU3 } = useLogin();
  const location = useLocation();

  const { address } = useAccount();
  const [modalImg, setModalImg] = useState('');
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

  useEffect(() => {
    if (address) {
      setFeedsType(FeedsType.FOLLOWING);
    } else {
      setFeedsType(FeedsType.TRENDING);
    }
  }, [address]);

  const titleElem = location.pathname.includes('post-detail') ? (
    <SocialBackNav />
  ) : (
    <SocialPageNav
      showFeedsTabs={isLoginU3 && !!address}
      feedsType={feedsType}
      onChangeFeedsType={(type) => {
        setFeedsType(type);
      }}
    />
  );

  return (
    <HomeWrapper id="social-wrapper">
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

        <Outlet context={{ setModalImg, socialPlatform, feedsType }} />

        {!isMobile && (
          <MainRight>
            <SearchInput placeholder="Search" onSearch={onSearch} />
            <SocialWhoToFollow />
          </MainRight>
        )}
      </MainWrapper>
      <ModalImg url={modalImg} onAfterClose={() => setModalImg('')} />
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
  position: sticky;
  top: 0;
  height: fit-content;
`;

const MainRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: fit-content;
`;
