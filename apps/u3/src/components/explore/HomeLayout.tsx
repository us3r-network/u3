import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { MainWrapper } from '../layout/Index';
import HotPosts from './posts/HotPosts';
import TopLinks from './links/TopLinks';
import HighScoreDapps from './dapps/HighScoreDapps';
import type { ExploreHomeState } from '../../container/explore/Home';
import DailyPosterBtn from '../poster/DailyPosterBtn';
import TopChannels from './channels/TopChannels';

export default function HomeLayout({
  hotPosts,
  topLinks,
  topChannels,
  highScoreDapps,
}: ExploreHomeState) {
  return (
    <Wrapper>
      <Main>
        <MainLeft>
          <HotPosts
            posts={hotPosts.posts}
            isLoading={hotPosts.isLoading}
            farcasterUserData={hotPosts.farcasterUserData}
          />
        </MainLeft>
        {/* <MainRight>
          <TopLinks links={topLinks.links} isLoading={topLinks.isLoading} />
        </MainRight> */}
      </Main>
      <TopChannels
        channels={topChannels.channels}
        isLoading={topChannels.isLoading}
      />
      {/* <Footer>
        <HighScoreDapps
          dapps={highScoreDapps.dapps}
          isLoading={highScoreDapps.isLoading}
        />
      </Footer> */}
    </Wrapper>
  );
}

const Wrapper = styled(MainWrapper)`
  padding-bottom: 80px;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  ${isMobile &&
  `
    gap: 20px;
    margin-bottom: 40px;
  `}
`;
const Main = styled.div`
  display: flex;
  gap: 20px;
  ${isMobile &&
  `
    flex-direction: column;
  `}
`;
const MainLeft = styled.div`
  width: 0;
  flex: 3;
  ${isMobile &&
  `
    width: 100%;
    felx: none;
  `}
`;
const MainRight = styled.div`
  width: 0;
  flex: 1;
  ${isMobile &&
  `
    width: 100%;
    felx: none;
  `}
`;
const Footer = styled.div`
  ${isMobile &&
  `
    width: 100%;
    overflow-x: auto;
  `}
`;
