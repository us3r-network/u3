import { useNavigate } from 'react-router-dom';
import Title from '../Title';
import DappCard, { DappData } from './DappCard';
import Loading from '../../common/loading/Loading';
import { cn } from '@/lib/utils';

export type HighScoreDappsData = Array<DappData & { id: number }>;

export default function HighScoreDapps({
  dapps,
  isLoading,
}: {
  dapps: HighScoreDappsData;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <Title
        text="👍 Highly Rated Dapps"
        viewAllAction={() => {
          navigate(`/dapp-store`);
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
            {dapps.map((item) => {
              return (
                <DappCard
                  key={item.id}
                  data={item}
                  onClick={() => navigate(`/dapp-store/${item.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
