/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useState } from 'react';
import { CastId, makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../../constants/farcaster';
import { FarCast, SocialPlatform } from '../../../services/social/types';
import useFarcasterUserData from '../../../hooks/social/farcaster/useFarcasterUserData';

import ReplyModal from '../ReplyModal';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import { UserData } from '@/utils/social/farcaster/user-data';

export default function FCastCommentPostModal({
  cast,
  open,
  closeModal,
  castId,
  farcasterUserData,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  open: boolean;
  closeModal: (withInc?: boolean) => void;
  castId: CastId;
}) {
  const { encryptedSigner, currFid } = useFarcasterCtx();

  const [text, setText] = useState('');

  const [isPending, setIsPending] = useState(false);
  const commentCast = useCallback(
    async (castId: CastId) => {
      if (!text || !encryptedSigner) return;
      setIsPending(true);
      try {
        const cast = (
          await makeCastAdd(
            {
              text,
              embeds: [],
              embedsDeprecated: [],
              mentions: [],
              mentionsPositions: [],
              parentCastId: castId,
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        toast.success('post created');
        closeModal(true);
      } catch (error) {
        console.error(error);
        toast.error('error creating post');
      } finally {
        setIsPending(false);
      }
    },
    [text, encryptedSigner, closeModal, currFid]
  );

  const userData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData,
    farcasterUserDataObj,
  });
  const currUserData = useFarcasterUserData({
    fid: `${currFid}`,
    farcasterUserData,
    farcasterUserDataObj,
  });

  return (
    <ReplyModal
      open={open}
      closeModal={closeModal}
      postData={{
        platform: SocialPlatform.Farcaster,
        avatar: userData.pfp,
        name: userData.display,
        handle: userData.fid,
        createdAt: cast.created_at,
        content: cast.text,
      }}
      avatar={currUserData.pfp}
      content={text}
      setContent={setText}
      onSubmit={() => {
        commentCast(castId);
      }}
      submitting={isPending}
    />
  );
}
