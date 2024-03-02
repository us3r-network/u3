import AddPostMobileBtn from '@/components/social/AddPostMobileBtn';
import { MobileHeaderBackBtn, MobileHeaderWrapper } from './MobileHeaderCommon';
import SearchIconBtn from '../SearchIconBtn';

export default function MobileExplorePostsHeader() {
  return (
    <MobileHeaderWrapper>
      <MobileHeaderBackBtn title="Posts" />
      <div className="flex items-center gap-[20px]">
        <SearchIconBtn />
        <AddPostMobileBtn />
      </div>
    </MobileHeaderWrapper>
  );
}
