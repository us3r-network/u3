import { useNavigate } from 'react-router-dom';
import CardBase from '../../common/card/CardBase';
import Title from '../Title';
import { SocialPlatform } from '../../../services/social/types';
import FarcasterPostCard from './FarcasterPostCard';
import Loading from '../../common/loading/Loading';
import { cn } from '@/lib/utils';

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
    <div className="w-full">
      <Title
        text="Hot Posts"
        viewAllAction={() => {
          navigate(`/social`);
        }}
      />
      <CardBase
        className={cn(
          'w-full h-[534px] mt-[20px]',
          'max-sm:bg-transparent max-sm:h-auto max-sm:p-0 max-sm:border-none max-sm:mt-[10px] max-sm:bg-none max-sm:overflow-visible'
        )}
      >
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div
            className={cn(
              'w-full h-full grid gap-[20px] auto-cols-auto auto-rows-auto',
              'max-sm:flex max-sm:flex-col max-sm:gap-[10px]'
            )}
          >
            {posts.map(({ platform, data }, idx) => {
              if (platform === SocialPlatform.Farcaster) {
                const id = Buffer.from(data.hash.data).toString('hex');
                return (
                  <FarcasterPostCard
                    key={id}
                    data={data}
                    farcasterUserData={farcasterUserData}
                    onClick={() => navigate(`/social/post-detail/fcast/${id}`)}
                    idx={idx}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </CardBase>
    </div>
  );
}
