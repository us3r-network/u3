import { useCallback } from 'react';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import { getFarcasterUserInfo } from '../../../services/social/api/farcaster';

export default function useUpsertFarcasterUserData() {
  const { setFarcasterUserData } = useFarcasterCtx();
  const upsertFarcasterUserData = useCallback(
    async ({ fid }: { fid: string | number }) => {
      const resp = await getFarcasterUserInfo([Number(fid)]);
      if (resp.data.code === 0) {
        const temp: {
          [key: string]: { type: number; value: string }[];
        } = {};
        temp[fid] = resp.data.data;
        setFarcasterUserData((pre) => ({ ...pre, ...temp }));
      }
    },
    []
  );

  return { upsertFarcasterUserData };
}
