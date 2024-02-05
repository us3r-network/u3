import { useMemo } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { cn } from '@/lib/utils';
import PostsFcMentionedLinks from './PostsFcMentionedLinks';

export default function PostsLayout() {
  const { pathname } = useLocation();
  const communityContext = useOutletContext<any>();

  const headerEl = useMemo(() => {
    if (pathname.includes('posts/detail')) {
      return <PostDetailHeader />;
    }
    // return <PostListHeader />;
    return null;
  }, [pathname]);

  return (
    <div className={cn(`w-full h-full flex`)}>
      <div id="posts-scroll-wrapper" className="flex-1 h-full overflow-auto">
        {headerEl}
        <Outlet
          context={{
            ...communityContext,
          }}
        />
      </div>
      <div className="w-[320px] h-full overflow-auto bg-[#1B1E23]">
        <PostsFcMentionedLinks />
      </div>
    </div>
  );
}

function PostListHeader() {
  const communityContext = useOutletContext<any>();
  const { feedsType, setFeedsType, socialPlatform, setSocialPlatform } =
    communityContext;
  return (
    <div className="w-full h-[40px] flex px-[20px] py-0 justify-between items-start self-stretch">
      <div>
        <button type="button">Trending</button>
      </div>
    </div>
  );
}
function PostDetailHeader() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[40px] flex px-[20px] py-0 justify-between items-start self-stretch">
      <div>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
