import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { MainWrapper } from '../layout/Index';
import PosterBanner from './poster/PosterBanner';
import HotPosts from './posts/HotPosts';
import TopLinks from './links/TopLinks';
import HighScoreDapps from './dapps/HighScoreDapps';
import type { ExploreState } from '../../container/Explore';

export default function ExploreLayout({
  hotPosts,
  topLinks,
  highScoreDapps,
}: ExploreState) {
  return (
    <Wrapper>
      <PosterBanner
        disabled={
          hotPosts.isLoading ||
          topLinks.isLoading ||
          highScoreDapps.isLoading ||
          // TODO 移动端poster改后再开启
          isMobile
        }
        posts={hotPosts.posts}
        farcasterUserData={hotPosts.farcasterUserData}
        dapps={highScoreDapps.dapps.slice(0, 6)}
        links={topLinks.links.slice(0, 3)}
      />
      <Main>
        <MainLeft>
          <HotPosts
            posts={hotPosts.posts}
            isLoading={hotPosts.isLoading}
            farcasterUserData={hotPosts.farcasterUserData}
          />
        </MainLeft>
        <MainRight>
          <TopLinks links={topLinks.links} isLoading={topLinks.isLoading} />
        </MainRight>
      </Main>
      <Footer>
        <HighScoreDapps
          dapps={highScoreDapps.dapps}
          isLoading={highScoreDapps.isLoading}
        />
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled(MainWrapper)`
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