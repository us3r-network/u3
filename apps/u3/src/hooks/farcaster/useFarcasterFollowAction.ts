import { makeLinkAdd, makeLinkRemove } from '@farcaster/hub-web';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from 'src/constants/farcaster';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
// import { getCurrFid } from 'src/utils/farsign-utils';

export default function useFarcasterFollowAction() {
  const [isPending, setIsPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // todo: check if following
  const { encryptedSigner, isConnected, openFarcasterQR, currFid } =
    useFarcasterCtx();

  const follow = useCallback(
    async (targetFid: number) => {
      if (!currFid) return;
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      setIsPending(true);
      // const currFid = getCurrFid();
      try {
        // eslint-disable-next-line no-underscore-dangle
        const cast = (
          await makeLinkAdd(
            {
              type: 'follow',
              targetFid,
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        toast.success('successfully followed');
        setIsFollowing(true);
      } catch (error: unknown) {
        console.error(error);
        toast.error('failed to followed');
      }
      setIsPending(false);
    },
    [currFid]
  );

  const unfollow = useCallback(
    async (targetFid: number) => {
      if (!currFid) return;
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      setIsPending(true);
      try {
        // eslint-disable-next-line no-underscore-dangle
        const cast = (
          await makeLinkRemove(
            {
              type: 'follow',
              targetFid,
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        toast.success('successfully unfollowed');
        setIsFollowing(false);
      } catch (error: unknown) {
        console.error(error);
        toast.error('failed to unfollowed');
      }
      setIsPending(false);
    },
    [currFid]
  );

  return {
    isPending,
    isFollowing,
    followAction: follow,
    unfollowAction: unfollow,
  };
}
