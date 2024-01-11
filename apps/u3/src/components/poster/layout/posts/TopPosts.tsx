import { SocialPlatform } from '../../../../services/social/types';
import FarcasterPostCard from './FarcasterPostCard';

export type TopPostsData = Array<{ data: any; platform: SocialPlatform }>;
export type TopPostsProps = {
  posts: TopPostsData;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
};
export default function TopPosts({ posts, farcasterUserData }: TopPostsProps) {
  const top1Post = posts[0];
  const topPosts = posts.slice(1, 4);
  return (
    <>
      <div className="w-0 flex-1 flex flex-col">
        <p className="text-[#000] text-[24px] font-bold leading-normal mb-[20px]">
          Daily Top 1 Cast
        </p>
        {(() => {
          const { platform, data } = top1Post;
          if (platform === SocialPlatform.Farcaster) {
            const id = Buffer.from(data.hash.data).toString('hex');
            return (
              <FarcasterPostCard
                key={id}
                data={data}
                farcasterUserData={farcasterUserData}
                isFirst
                className="flex-1"
              />
            );
          }
          return null;
        })()}
      </div>
      <div className="w-0 flex-1">
        <p className="text-[#000] text-[16px] font-bold leading-normal underline">
          Top Casts
        </p>
        <div className="grid grid-cols-1 gap-[10px] divide-y divide-[#808684]">
          {topPosts.map(({ platform, data }) => {
            if (platform === SocialPlatform.Farcaster) {
              const id = Buffer.from(data.hash.data).toString('hex');
              return (
                <FarcasterPostCard
                  key={id}
                  data={data}
                  farcasterUserData={farcasterUserData}
                  className="pt-[10px]"
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
}
