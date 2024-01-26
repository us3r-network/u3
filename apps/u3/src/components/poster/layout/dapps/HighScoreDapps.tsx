import { useNavigate } from 'react-router-dom';
import DappCard, { DappData } from './DappCard';

export type HighScoreDappsData = Array<DappData & { id: number }>;
export type HighScoreDappsProps = {
  dapps: HighScoreDappsData;
};
export default function HighScoreDapps({ dapps }: HighScoreDappsProps) {
  const navigate = useNavigate();
  return (
    <div className="w-0 flex-1">
      <p className="text-[#000] text-[16px] font-bold leading-normal underline mb-[10px]">
        Highly Rated Apps
      </p>
      <div className="flex divide-x divide-[#808684]">
        {dapps.map((item) => {
          return (
            <DappCard
              key={item.id}
              data={item}
              className="first:pr-[10px] last:pl-[10px] cursor-pointer"
              onClick={() => navigate(`/apps/${item.id}`)}
              title={`/apps/${item.id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
