import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';

export default function useFarcasterCurrFid() {
  const { currFid } = useFarcasterCtx();
  return `${currFid}`;
}
