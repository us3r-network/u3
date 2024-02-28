import { useOutletContext } from 'react-router-dom';
import { CurrencyETH } from '../../components/common/icons/currency-eth';
import Rss3Content from '../../components/fren/Rss3Content';
import { ProfileOutletContext } from './ProfileLayout';

function Activity() {
  const { address: wallets } = useOutletContext<ProfileOutletContext>();
  return (
    <div className="flex flex-col g-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white-400 font-bold">Activity</h3>
        <div className="bg-black">
          <p className="text-sm text-gray-400">{wallets[0]}</p>
        </div>
      </div>
      <Rss3Content address={wallets} empty={<NoActivity />} />
    </div>
  );
}
export default Activity;
export function NoActivity() {
  return (
    <div className="no-item">
      <CurrencyETH />
      <p>No transactions found on Ethereum.</p>
    </div>
  );
}
