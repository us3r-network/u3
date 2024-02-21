/* eslint-disable @typescript-eslint/no-shadow */
import { CastId } from '@farcaster/hub-web';
import { ComponentPropsWithRef, useMemo } from 'react';
import { UserData } from 'src/utils/social/farcaster/user-data';

import { useFavorAction } from '@us3r-network/link';
import { Link } from '@us3r-network/data-model';
import { toast } from 'react-toastify';
import useFarcasterCastId from '../../../hooks/social/farcaster/useFarcasterCastId';
// import { getCurrFid } from '../../../utils/farsign-utils';
import { FarCast } from '../../../services/social/types';
import useLogin from '../../../hooks/shared/useLogin';
import useFarcasterLikeAction from '@/hooks/social/farcaster/useFarcasterLikeAction';
import useFarcasterRecastAction from '@/hooks/social/farcaster/useFarcasterRecastAction';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { cn } from '@/lib/utils';

export default function FCastSuperLike({
  cast,
  linkId,
  link,
  openFarcasterQR,
  onLikeSuccess,
  onRecastSuccess,
  onSaveSuccess,
}: ComponentPropsWithRef<'div'> & {
  cast: FarCast;
  linkId?: string;
  link?: Link;
  openFarcasterQR: () => void;
  onLikeSuccess?: () => void;
  onRecastSuccess?: () => void;
  onSaveSuccess?: (newLinkId: string) => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { isConnected } = useFarcasterCtx();
  const { likeCast, liked, likePending } = useFarcasterLikeAction({
    cast,
    onLikeSuccess,
  });
  const { recast, recasted, recastPending } = useFarcasterRecastAction({
    cast,
    onRecastSuccess,
  });
  const castId: CastId = useFarcasterCastId({ cast });

  const { isFavored, isFavoring, onFavor } = useFavorAction(linkId, link, {
    onSuccessfullyFavor: (done: boolean, newLinkId: string) => {
      onSaveSuccess?.(newLinkId);
      toast.success('Save successful');
    },
    onFailedFavor: (err: string) => {
      toast.error(`Save failed: ${err}`);
    },
  });
  const superLikeAction = () => {
    if (likePending || recastPending || isFavoring) {
      return;
    }
    if (!isLoginU3) {
      loginU3();
      return;
    }
    if (!isConnected) {
      openFarcasterQR();
      return;
    }
    if (!liked) {
      likeCast(castId);
    }
    if (!recasted) {
      recast(castId);
    }
    if (!isFavored) {
      onFavor();
    }
  };
  const superLiked = liked && recasted && isFavored;
  console.log('superLiked', { superLiked, liked, recasted, isFavored });

  return (
    <div
      className={cn(
        'text-[#718096] text-center text-[12px] font-normal cursor-pointer',
        superLiked && 'text-[#F41F4C] cursor-not-allowed'
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!superLiked) {
          superLikeAction();
        }
      }}
    >
      🎩 Super Like
    </div>
  );
}
