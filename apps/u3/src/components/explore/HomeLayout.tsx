import { MainWrapper } from '../layout/Index';
import HotPosts from './posts/HotPosts';
import type { ExploreHomeState } from '../../container/explore/Home';
import TopChannels from './channels/TopChannels';

export default function HomeLayout({
  hotPosts,
  topChannels,
}: ExploreHomeState) {
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
    </MainWrapper>
  );
}
