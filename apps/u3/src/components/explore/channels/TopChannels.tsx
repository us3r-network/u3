import { useNavigate } from 'react-router-dom';
import Title from '../Title';
import Loading from '../../common/loading/Loading';
import { cn } from '@/lib/utils';
import ChannelCard, { ChannelData } from './ChannelCard';
import { getCommunityPath } from '@/route/path';

export type TopChannelsData = Array<ChannelData & { channel_id: string }>;

export default function TopChannels({
  channels,
  isLoading,
}: {
  channels: TopChannelsData;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <Title
        text="👍 Top Topics"
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
              'w-full grid gap-[20px] md:grid-cols-2 lg:grid-cols-4',
              'max-sm:grid-cols-1 max-sm:gap-[10px]'
            )}
          >
            {channels.map((item) => {
              return (
                <ChannelCard
                  key={item.channel_id}
                  data={item}
                  onClick={() => navigate(getCommunityPath(item.channel_id))}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
