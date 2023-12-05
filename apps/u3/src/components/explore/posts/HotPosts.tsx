import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import CardBase from '../../common/card/CardBase';
import Title from '../Title';
import { SocialPlatform } from '../../../services/social/types';
import FarcasterPostCard from './FarcasterPostCard';
import Loading from '../../common/loading/Loading';

export type HotPostsData = Array<{ data: any; platform: SocialPlatform }>;
export default function HotPosts({
  posts,
  isLoading,
  farcasterUserData,
}: {
  posts: HotPostsData;
  isLoading: boolean;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
}) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Title
        text="🔥 Hot Posts"
        viewAllAction={() => {
          navigate(`/social`);
        }}
      />
      <CardsWrapper>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <CardsLayout>
            {posts.map(({ platform, data }) => {
              if (platform === SocialPlatform.Farcaster) {
                const id = Buffer.from(data.hash.data).toString('hex');
                return (
                  <FarcasterPostCard
                    key={id}
                    data={data}
                    farcasterUserData={farcasterUserData}
                    onClick={() => navigate(`/social/post-detail/fcast/${id}`)}
                  />
                );
              }
              return null;
            })}
          </CardsLayout>
        )}
      </CardsWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
`;
const CardsWrapper = styled(CardBase)`
  width: 100%;
  height: 534px;
  margin-top: 20px;
  ${isMobile &&
  `
    height: auto;
    padding: 0;
    border: none;
    margin-top: 10px;
    background: none;
    overflow: visible;
  `}
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${isMobile &&
  `
    height: 430px;
  `}
`;
const CardsLayout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 20px;
  grid-auto-columns: auto;
  grid-auto-rows: auto;
  ${isMobile &&
  `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `}
`;
