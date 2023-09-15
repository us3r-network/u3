import { useState } from 'react';
import { CastId } from '@farcaster/hub-web';

import { FarCast } from '../../../api';
import { useFarcasterCtx } from '../../../contexts/FarcasterCtx';
import FCastCommentPostModal from './FCastCommentPostModal';
import useFarcasterCastId from '../../../hooks/farcaster/useFarcasterCastId';
import PostReply from '../PostReply';
import useLogin from '../../../hooks/useLogin';
import useFarcasterCurrFid from '../../../hooks/farcaster/useFarcasterCurrFid';

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
    Number(cast.comment_count || 0)
  );
  const currFid: string = useFarcasterCurrFid();
  const [openComment, setOpenComment] = useState(false);
  const { isConnected } = useFarcasterCtx();
  const castId: CastId = useFarcasterCastId({ cast });
  return (
    <>
      <PostReply
        replied={cast.comments?.includes(currFid)}
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
