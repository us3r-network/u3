import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../layout/Index';
import HotPosts from './posts/HotPosts';
import type { ExploreHomeState } from '../../container/explore/Home';
import ColorButton from '../common/button/ColorButton';
import HotCommunities from './community/HotCommunities';

export default function HomeLayout({
  hotPosts,
  hotCommunities,
}: ExploreHomeState) {
  const navigate = useNavigate();
  return (
    <MainWrapper>
      <HotPosts
        posts={hotPosts.posts}
        isLoading={hotPosts.isLoading}
        farcasterUserData={hotPosts.farcasterUserData}
      />
      <HotCommunities
        communities={hotCommunities.communities}
        isLoading={hotCommunities.isLoading}
      />
      <div className="items-center justify-between gap-[10px] hidden max-sm:flex">
        <ColorButton
          className="flex-1"
          onClick={() => {
            navigate('/caster-daily');
          }}
        >
          Mint Poster
        </ColorButton>
        <ColorButton
          className="flex-1"
          onClick={() => {
            navigate('/poster-gallery');
          }}
        >
          Poster Gallery
        </ColorButton>
      </div>
    </MainWrapper>
  );
}
