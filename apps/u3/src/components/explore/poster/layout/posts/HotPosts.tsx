import styled from 'styled-components';
import { SocialPlatform } from '../../../../../services/social/types';
import FarcasterPostCard from './FarcasterPostCard';
import ContentDividingLine from '../ContentDividingLine';

export type HotPostsData = Array<{ data: any; platform: SocialPlatform }>;
export type HotPostsProps = {
  posts: HotPostsData;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
};
export default function HotPosts({ posts, farcasterUserData }: HotPostsProps) {
  const firstPost = posts[0];
  const secondAndThirdPosts = posts.slice(1, 3);
  const lastThreePosts = posts.slice(3);
  return (
    <Wrapper>
      <ContentDividingLine />
      <FirstThreePostsWrapper>
        {(() => {
          const { platform, data } = firstPost;
          if (platform === SocialPlatform.Farcaster) {
            const id = Buffer.from(data.hash.data).toString('hex');
            return (
              <FirstFarcasterPostCard
                key={id}
                data={data}
                farcasterUserData={farcasterUserData}
                isFirst
              />
            );
          }
          return null;
        })()}
        <FirstThreeVerticalLine />
        <SecondAndThirdPostsWrapper>
          {secondAndThirdPosts.map(({ platform, data }, idx) => {
            if (platform === SocialPlatform.Farcaster) {
              const id = Buffer.from(data.hash.data).toString('hex');
              return (
                <>
                  {idx !== 0 && <SecondAndThirdHorizontalLine />}
                  <SecondAndThirdFarcasterPostCard
                    key={id}
                    data={data}
                    farcasterUserData={farcasterUserData}
                  />
                </>
              );
            }
            return null;
          })}
        </SecondAndThirdPostsWrapper>
      </FirstThreePostsWrapper>
      <LastThreeHorizontalLine />
      <LastThreePostsWrapper>
        {lastThreePosts.map(({ platform, data }, idx) => {
          if (platform === SocialPlatform.Farcaster) {
            const id = Buffer.from(data.hash.data).toString('hex');
            return (
              <>
                {idx !== 0 && <LastThreeVerticalLine />}
                <LastThreeFarcasterPostCard
                  key={id}
                  data={data}
                  farcasterUserData={farcasterUserData}
                />
              </>
            );
          }
          return null;
        })}
      </LastThreePostsWrapper>
      <LastThreeHorizontalLine />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const FirstThreePostsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;
const FirstFarcasterPostCard = styled(FarcasterPostCard)`
  width: 0;
  flex: 2;
`;
const FirstThreeVerticalLine = styled.div`
  width: 1px;
  align-self: stretch;
  background: #000;
`;
const SecondAndThirdPostsWrapper = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;
const SecondAndThirdFarcasterPostCard = styled(FarcasterPostCard)`
  width: 100%;
  height: 0;
  flex: 1;
`;
const SecondAndThirdHorizontalLine = styled.div`
  height: 1px;
  align-self: stretch;
  background: #000;
`;
const LastThreeHorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background: #000;
`;
const LastThreePostsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 20px;
`;
const LastThreeFarcasterPostCard = styled(FarcasterPostCard)`
  flex: 1;
  align-self: stretch;
  justify-content: space-around;
`;
const LastThreeVerticalLine = styled.div`
  width: 1px;
  align-self: stretch;
  flex-shrink: 0;
  background: #000;
`;
