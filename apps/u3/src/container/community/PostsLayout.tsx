import { useMemo } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { cn } from '@/lib/utils';
import PostsFcMentionedLinks from './PostsFcMentionedLinks';
import { ArrowLeft } from '@/components/common/icons/ArrowLeft';

export default function PostsLayout() {
  const { pathname } = useLocation();
  const communityContext = useOutletContext<any>();

  const headerEl = useMemo(() => {
    const pathSplit = pathname.split('posts/fc/');
    const isDetail = !!pathSplit[1];
    if (isDetail) {
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
    <div className="w-full h-[40px] flex my-[20px] justify-between items-start self-stretch">
      <div>
        <button
          type="button"
          className="rounded-[50%] w-[40px] h-[40px] flex justify-center items-center flex-shrink-0 border-[1px] border-solid border-[#39424c] bg-[var(--neutral-100,_#1a1e23)] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft />
        </button>
      </div>
    </div>
  );
}
