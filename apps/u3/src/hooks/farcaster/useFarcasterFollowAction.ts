import { makeLinkAdd, makeLinkRemove } from '@farcaster/hub-web';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from 'src/constants/farcaster';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
import { getCurrFid } from 'src/utils/farsign-utils';

export default function useFarcasterFollowAction() {
  const { encryptedSigner, isConnected, openFarcasterQR } = useFarcasterCtx();
  const follow = useCallback(async (targetFid: number) => {
    if (!isConnected) {
      openFarcasterQR();
      return;
    }
    if (!encryptedSigner) return;
    const currFid = getCurrFid();
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
    } catch (error: any) {
      console.error(error);
      toast.error('failed to followed');
    }
  }, []);

  const unfollow = useCallback(async (targetFid: number) => {
    if (!isConnected) {
      openFarcasterQR();
      return;
    }
    if (!encryptedSigner) return;
    const currFid = getCurrFid();
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
      toast.success('successfully followed');
    } catch (error: any) {
      console.error(error);
      toast.error('failed to followed');
    }
  }, []);

  return {
    followAction: follow,
    unfollowAction: unfollow,
  };
}
