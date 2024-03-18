import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { QuickSearchModalName } from '../social/QuickSearchModal';
import SearchIcon from '../common/icons/SearchIcon';

export default function SearchIconBtn() {
  const { setOpenModalName } = useFarcasterCtx();
  return <SearchIcon onClick={() => setOpenModalName(QuickSearchModalName)} />;
}
