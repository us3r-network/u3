import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../layout/Index';
import HotPosts from './posts/HotPosts';
import type { ExploreHomeState } from '../../container/explore/Home';
import TopChannels from './channels/TopChannels';
import ColorButton from '../common/button/ColorButton';

export default function HomeLayout({
  hotPosts,
  topChannels,
}: ExploreHomeState) {
  const navigate = useNavigate();
  return (
    <MainWrapper>
      <HotPosts
        posts={hotPosts.posts}
        isLoading={hotPosts.isLoading}
        farcasterUserData={hotPosts.farcasterUserData}
      />
      <TopChannels
        channels={topChannels.channels}
        isLoading={topChannels.isLoading}
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
