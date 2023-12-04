import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { MainWrapper } from '../components/layout/Index';
import PosterBanner from '../components/explore/poster/PosterBanner';
import HotPosts, { HotPostsData } from '../components/explore/posts/HotPosts';
import TopLinks, { TopLinksData } from '../components/explore/links/TopLinks';
import HighScoreDapps, {
  HighScoreDappsData,
} from '../components/explore/dapps/HighScoreDapps';
import {
  getHotPosts,
  getTopLinks,
  getHighScoreDapps,
} from '../services/shared/api/explore';
import { processMetadata } from '../utils/news/link';

type FarcasterUserData = { [key: string]: { type: number; value: string }[] };

export default function Explore() {
  const [hotPosts, setHotPosts] = useState<{
    posts: HotPostsData;
    farcasterUserData: FarcasterUserData;
    isLoading: boolean;
  }>({
    posts: [],
    farcasterUserData: {},
    isLoading: true,
  });

  const [topLinks, setTopLinks] = useState<{
    links: TopLinksData;
    isLoading: boolean;
  }>({
    links: [],
    isLoading: true,
  });

  const [highScoreDapps, setHighScoreDapps] = useState<{
    dapps: HighScoreDappsData;
    isLoading: boolean;
  }>({
    dapps: [],
    isLoading: true,
  });

  useEffect(() => {
    getHotPosts()
      .then((res) => {
        const { data } = res.data;
        const { casts, farcasterUserData: farcasterUserDataTmp } = data;

        const temp: FarcasterUserData = {};
        farcasterUserDataTmp.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        setHotPosts({
          posts: casts.splice(0, 6),
          farcasterUserData: temp,
          isLoading: false,
        });
      })
      .catch(() => {
        setHotPosts((pre) => ({ ...pre, posts: [], isLoading: false }));
      });

    getTopLinks()
      .then((res) => {
        const { data } = res.data;
        const { data: links } = data;
        setTopLinks({
          links: (links || []).map((item) => {
            const metadata = processMetadata(item?.metadata);
            return {
              logo: metadata?.icon,
              name: metadata?.title,
              url: item?.url,
            };
          }),
          isLoading: false,
        });
      })
      .catch(() => {
        setTopLinks((pre) => ({ ...pre, links: [], isLoading: false }));
      });

    getHighScoreDapps()
      .then((res) => {
        const { data: dapps } = res.data;

        setHighScoreDapps({
          dapps: dapps.map((item) => ({
            id: item.id,
            logo: item.image,
            name: item.name,
            types: item?.types || [],
            linkStreamId: item?.linkStreamId,
          })),
          isLoading: false,
        });
      })
      .catch(() => {
        setHighScoreDapps((pre) => ({ ...pre, dapps: [], isLoading: false }));
      });
  }, []);
  return (
    <Wrapper>
      <PosterBanner
        disabled={
          hotPosts.isLoading || topLinks.isLoading || highScoreDapps.isLoading
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
  `}
`;
const Main = styled.div`
  display: flex;
  gap: 20px;
`;
const MainLeft = styled.div`
  width: 0;
  flex: 3;
`;
const MainRight = styled.div`
  width: 0;
  flex: 1;
`;
const Footer = styled.div``;
