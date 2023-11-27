/* eslint-disable @typescript-eslint/no-shadow */
import {
  CastId,
  ReactionType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { FarCast } from '../../../services/social/types';
// import { useFarcasterReactionCast } from '../hooks/farcaster/useFarcaster'
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../../constants/farcaster';
import useFarcasterCastId from '../../../hooks/social/farcaster/useFarcasterCastId';
import useFarcasterCurrFid from '../../../hooks/social/farcaster/useFarcasterCurrFid';
// import { getCurrFid } from '../../../utils/farsign-utils';
import PostReport from '../PostRepost';
import useLogin from '../../../hooks/shared/useLogin';

export default function FCastRecast({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  openFarcasterQR: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { encryptedSigner, isConnected, currFid } = useFarcasterCtx();
  const [recasts, setRecasts] = useState<string[]>(
    Array.from(new Set(cast.recasts))
  );
  const [recastCount, setRecastCount] = useState<number>(
    Number(cast.recast_count || cast.recastsCount || 0)
  );

  const recast = useCallback(
    async (castId: CastId) => {
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      try {
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

        toast.success('recast created');
      } catch (error) {
        toast.error('error recast');
      }
    },
    [
      encryptedSigner,
      isConnected,
      openFarcasterQR,
      recastCount,
      recasts,
      currFid,
    ]
  );

  const removeRecast = useCallback(
    async (castId: CastId) => {
      if (!currFid) return;
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      // const currFid = getCurrFid();
      try {
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

        toast.success('removed recast');
      } catch (error) {
        toast.error('error recast');
      }
    },
    [
      encryptedSigner,
      isConnected,
      openFarcasterQR,
      recastCount,
      recasts,
      currFid,
    ]
  );

  // const currFid: string = useFarcasterCurrFid();
  const castId: CastId = useFarcasterCastId({ cast });

  return (
    <PostReport
      reposted={recasts.includes(`${currFid}`)}
      totalReposts={recastCount}
      repostAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (recasts.includes(`${currFid}`)) {
          removeRecast(castId);
        } else {
          recast(castId);
        }
      }}
    />
  );
}
