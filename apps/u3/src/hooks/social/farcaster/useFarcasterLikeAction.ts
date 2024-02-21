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

export default function useFarcasterLikeAction({
  cast,
  onLikeSuccess,
  onRemoveLikeSuccess,
}: {
  cast: FarCast;
  onLikeSuccess?: () => void;
  onRemoveLikeSuccess?: () => void;
}) {
  const { encryptedSigner, isConnected, currFid } = useFarcasterCtx();
  const [likes, setLikes] = useState<string[]>(Array.from(new Set(cast.likes)));
  const [likeCount, setLikeCount] = useState<number>(
    Number(cast.like_count || cast.likesCount || 0)
  );
  useEffect(() => {
    setLikes(Array.from(new Set(cast.likes)));
    setLikeCount(Number(cast.like_count || cast.likesCount || 0));
  }, [cast]);
  const [likePending, setLikePending] = useState(false);

  const likeCast = useCallback(
    async (castId: CastId) => {
      if (likePending) {
        return;
      }
      if (!isConnected) {
        return;
      }
      if (!encryptedSigner) {
        console.error('no encryptedSigner');
        return;
      }
      try {
        setLikePending(true);
        const cast = await makeReactionAdd(
          {
            type: ReactionType.LIKE,
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

        const tmpSet = new Set(likes);
        tmpSet.add(`${currFid}`);
        setLikes(Array.from(tmpSet));
        setLikeCount(likeCount + 1);
        onLikeSuccess?.();

        toast.success('like post created');
      } catch (error) {
        console.error(error);
        toast.error('error like');
      } finally {
        setLikePending(false);
      }
    },
    [
      encryptedSigner,
      isConnected,
      likeCount,
      likes,
      currFid,
      likePending,
      onLikeSuccess,
    ]
  );

  const removeLikeCast = useCallback(
    async (castId: CastId) => {
      if (likePending) {
        return;
      }
      if (!isConnected) {
        return;
      }
      if (!encryptedSigner) return;
      // const currFid = getCurrFid();
      try {
        setLikePending(true);
        const cast = await makeReactionRemove(
          {
            type: ReactionType.LIKE,
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

        const tmpSet = new Set(likes);
        tmpSet.delete(`${currFid}`);
        setLikes(Array.from(tmpSet));
        setLikeCount(likeCount - 1);
        onRemoveLikeSuccess?.();
        toast.success('like post removed');
      } catch (error) {
        toast.error('error like');
      } finally {
        setLikePending(false);
      }
    },
    [
      encryptedSigner,
      isConnected,
      likeCount,
      likes,
      currFid,
      likePending,
      onRemoveLikeSuccess,
    ]
  );

  const liked = likes.includes(`${currFid}`);

  return {
    likes,
    likeCount,
    likeCast,
    removeLikeCast,
    liked,
    likePending,
  };
}
