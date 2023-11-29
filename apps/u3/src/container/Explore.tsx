import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { MainWrapper } from '../components/layout/Index';
import HotPosts from '../components/explore/hot-posts/HotPosts';
import { getFarcasterTrending } from '../services/social/api/farcaster';

export default function Explore() {
  const [hotPosts, setHotPosts] = useState({
    posts: [],
    farcasterUserData: {},
    isLoading: true,
  });

  useEffect(() => {
    // TODO 后期换成包含farcaster和lens的trending
    getFarcasterTrending({ start: 0, end: 15 })
      .then((res) => {
        const { data } = res.data;
        const { casts, farcasterUserData: farcasterUserDataTmp } = data;

        const temp: { [key: string]: { type: number; value: string }[] } = {};
        farcasterUserDataTmp.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        setHotPosts((pre) => ({
          ...pre,
          posts: casts.splice(0, 6),
          farcasterUserData: temp,
        }));
      })
      .finally(() => {
        setHotPosts((pre) => ({ ...pre, isLoading: false }));
      });
  }, []);
  return (
    <Wrapper>
      <Header>Poster</Header>
      <Main>
        <MainLeft>
          <HotPosts
            posts={hotPosts.posts}
            isLoading={hotPosts.isLoading}
            farcasterUserData={hotPosts.farcasterUserData}
          />
        </MainLeft>
        <MainRight>right</MainRight>
      </Main>
      <Footer>dapps</Footer>
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
const Header = styled.div``;
const Main = styled.div`
  display: flex;
  gap: 20px;
`;
const MainLeft = styled.div`
  flex: 3;
`;
const MainRight = styled.div`
  flex: 1;
`;
const Footer = styled.div``;
