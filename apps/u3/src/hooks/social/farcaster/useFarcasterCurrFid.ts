import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';

export default function useFarcasterCurrFid() {
  const { currFid } = useFarcasterCtx();
  return `${currFid}`;
}
