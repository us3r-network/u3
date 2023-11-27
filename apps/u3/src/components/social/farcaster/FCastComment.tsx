import { useState } from 'react';
import { CastId } from '@farcaster/hub-web';

import { FarCast } from '../../../services/social/types';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import FCastCommentPostModal from './FCastCommentPostModal';
import useFarcasterCastId from '../../../hooks/social/farcaster/useFarcasterCastId';
import PostReply from '../PostReply';
import useLogin from '../../../hooks/shared/useLogin';
import useFarcasterCurrFid from '../../../hooks/social/farcaster/useFarcasterCurrFid';

export default function FCastComment({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  openFarcasterQR: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const [commentCount, setCommentCount] = useState(
    Number(cast.comment_count || cast.repliesCount || 0)
  );
  const currFid: string = useFarcasterCurrFid();
  const [openComment, setOpenComment] = useState(false);
  const { isConnected } = useFarcasterCtx();
  const castId: CastId = useFarcasterCastId({ cast });
  return (
    <>
      <PostReply
        replied={(cast.comments || cast.replies)?.includes(currFid)}
        totalReplies={commentCount}
        replyAction={() => {
          if (!isLoginU3) {
            loginU3();
            return;
          }
          if (!isConnected) {
            openFarcasterQR();
            return;
          }
          setOpenComment(true);
        }}
      />

      <FCastCommentPostModal
        cast={cast}
        farcasterUserData={farcasterUserData}
        castId={castId}
        open={openComment}
        closeModal={(withInc) => {
          if (withInc === true) {
            setCommentCount((pre) => pre + 1);
          }
          setOpenComment(false);
        }}
      />
    </>
  );
}
