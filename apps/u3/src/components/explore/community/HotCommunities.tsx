import { useNavigate } from 'react-router-dom';
import Title from '../Title';
import Loading from '../../common/loading/Loading';
import { cn } from '@/lib/utils';
import { CommunityInfo } from '@/services/community/types/community';
import CommunityItem from './CommunityItem';

export type HotCommunitiesData = Array<CommunityInfo>;

export default function HotCommunities({
  communities,
  isLoading,
}: {
  communities: HotCommunitiesData;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <Title
        text="Hot Communities"
        viewAllAction={() => {
          navigate(`/communities`);
        }}
      />
      <div className={cn('w-full mt-[20px]', 'max-sm:mt-[10px]')}>
        {isLoading ? (
          <div
            className={cn(
              'w-full h-full flex justify-center items-center',
              'max-sm:h-[430px]'
            )}
          >
            <Loading />
          </div>
        ) : (
          <div
            className={cn(
              'w-full grid gap-[20px] grid-cols-3',
              'max-sm:grid-cols-1 max-sm:gap-[10px]'
            )}
          >
            {communities.map((item) => {
              return <CommunityItem key={item.id} communityInfo={item} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
