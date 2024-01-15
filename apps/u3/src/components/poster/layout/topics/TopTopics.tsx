import { useNavigate } from 'react-router-dom';
import TopicCard, { TopicData } from './TopicCard';

export type TopTopicsData = Array<TopicData>;
export type TopTopicsProps = {
  topics: TopTopicsData;
};
export default function TopTopics({ topics }: TopTopicsProps) {
  const navigate = useNavigate();
  return (
    <div className="w-0 flex-1">
      <p className="text-[#000] text-[16px] font-bold leading-normal underline mb-[10px]">
        Top Topics
      </p>
      <div className="flex divide-x divide-[#808684]">
        {topics.map((item) => {
          return (
            <TopicCard
              key={item.name}
              data={item}
              className="first:pr-[10px] last:pl-[10px] cursor-pointer"
              onClick={() => navigate(`/social/channel/${item.channel_id}`)}
              title={`/social/channel/${item.channel_id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
