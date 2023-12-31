import { makeLinkAdd, makeLinkRemove } from '@farcaster/hub-web';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from 'src/constants/farcaster';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
// import { getCurrFid } from 'src/utils/farsign-utils';

export default function useFarcasterFollowAction() {
  const [isPending, setIsPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(undefined); // todo: check if following
  const {
    encryptedSigner,
    isConnected,
    openFarcasterQR,
    currFid,
    setFollowing,
  } = useFarcasterCtx();

  const follow = useCallback(
    async (targetFid: number | string) => {
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!currFid) return;
      if (!encryptedSigner) return;
      if (Number.isNaN(Number(targetFid))) return;
      setIsPending(true);
      // const currFid = getCurrFid();
      try {
        // eslint-disable-next-line no-underscore-dangle
        const cast = (
          await makeLinkAdd(
            {
              type: 'follow',
              targetFid: Number(targetFid),
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        setFollowing((prev) => [...prev, String(targetFid)]);
        toast.success('farcaster follow success');
        setIsFollowing(true);
      } catch (error: unknown) {
        console.error(error);
        toast.error('farcaster follow failed');
      }
      setIsPending(false);
    },
    [currFid]
  );

  const unfollow = useCallback(
    async (targetFid: number | string) => {
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!currFid) return;
      if (!encryptedSigner) return;
      if (Number.isNaN(Number(targetFid))) return;
      setIsPending(true);
      try {
        // eslint-disable-next-line no-underscore-dangle
        const cast = (
          await makeLinkRemove(
            {
              type: 'follow',
              targetFid: Number(targetFid),
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        setFollowing((prev) => prev.filter((fid) => fid !== String(targetFid)));
        toast.success('farcaster unfollow success');
        setIsFollowing(false);
      } catch (error: unknown) {
        console.error(error);
        toast.error('farcaster unfollow failed');
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
