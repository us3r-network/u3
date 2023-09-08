import { useMemo } from 'react';

import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
import { getCurrFid } from '../../utils/farsign-utils';

export default function useFarcasterCurrFid() {
  const { isConnected } = useFarcasterCtx();
  const currFid: string = useMemo(() => {
    const fid = getCurrFid();
    return `${fid}`;
  }, [isConnected]);
  return currFid;
}
