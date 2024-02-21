/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useState } from 'react';
import {
  CastId,
  ReactionType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { FarCast } from '@/services/social/types';
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '@/constants/farcaster';

export default function useFarcasterRecastAction({
  cast,
  onRecastSuccess,
  onRemoveRecastSuccess,
}: {
  cast: FarCast;
  onRecastSuccess?: () => void;
  onRemoveRecastSuccess?: () => void;
}) {
  const { encryptedSigner, isConnected, currFid } = useFarcasterCtx();
  const [recasts, setRecasts] = useState<string[]>(
    Array.from(new Set(cast.recasts))
  );
  const [recastCount, setRecastCount] = useState<number>(
    Number(cast.recast_count || cast.recastsCount || 0)
  );
  useEffect(() => {
    setRecasts(Array.from(new Set(cast.recasts)));
    setRecastCount(Number(cast.recast_count || cast.recastsCount || 0));
  }, [cast]);

  const [recastPending, setRecastPending] = useState(false);

  const recast = useCallback(
    async (castId: CastId) => {
      if (recastPending) {
        return;
      }
      if (!isConnected) {
        return;
      }
      if (!encryptedSigner) return;
      try {
        setRecastPending(true);
        const cast = await makeReactionAdd(
          {
            type: ReactionType.RECAST,
            targetCastId: castId,
          },
          {
            fid: currFid,
            network: FARCASTER_NETWORK,
          },
          encryptedSigner
        );
        if (cast.isErr()) {
          throw new Error(cast.error.message);
        }

        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast.value);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const tmpSet = new Set(recasts);
        tmpSet.add(`${currFid}`);
        setRecasts(Array.from(tmpSet));
        setRecastCount(recastCount + 1);
        onRecastSuccess?.();
        toast.success('recast created');
      } catch (error) {
        toast.error('error recast');
      } finally {
        setRecastPending(false);
      }
    },
    [
      encryptedSigner,
      isConnected,
      recastCount,
      recasts,
      currFid,
      recastPending,
      onRecastSuccess,
    ]
  );

  const removeRecast = useCallback(
    async (castId: CastId) => {
      if (recastPending) {
        return;
      }
      if (!currFid) return;
      if (!isConnected) {
        return;
      }
      if (!encryptedSigner) return;
      // const currFid = getCurrFid();
      try {
        setRecastPending(true);
        const cast = await makeReactionRemove(
          {
            type: ReactionType.RECAST,
            targetCastId: castId,
          },
          {
            fid: currFid,
            network: FARCASTER_NETWORK,
          },
          encryptedSigner
        );
        if (cast.isErr()) {
          throw new Error(cast.error.message);
        }

        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast.value);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const tmpSet = new Set(recasts);
        tmpSet.delete(`${currFid}`);
        setRecasts(Array.from(tmpSet));
        setRecastCount(recastCount - 1);
        onRemoveRecastSuccess?.();

        toast.success('removed recast');
      } catch (error) {
        toast.error('error recast');
      } finally {
        setRecastPending(false);
      }
    },
    [
      encryptedSigner,
      isConnected,
      recastCount,
      recasts,
      currFid,
      onRemoveRecastSuccess,
    ]
  );
  const recasted = recasts.includes(`${currFid}`);
  return {
    recast,
    removeRecast,
    recasts,
    recastCount,
    recasted,
    recastPending,
  };
}
