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
      <ColorButton
        className="hidden max-sm:flex"
        onClick={() => {
          navigate('/poster-gallery');
        }}
      >
        Poster Gallery
      </ColorButton>
    </MainWrapper>
  );
}
