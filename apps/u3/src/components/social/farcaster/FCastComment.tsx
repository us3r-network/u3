/* eslint-disable no-underscore-dangle */
import { useCallback, useState } from 'react';
import { Channel } from '@mod-protocol/farcaster';
import { CastAddBody, makeCastAdd } from '@farcaster/hub-web';
import { Cross2Icon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';

import { FarCast } from '../../../services/social/types';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import PostReply from '../PostReply';
import useLogin from '../../../hooks/shared/useLogin';
import useFarcasterCurrFid from '../../../hooks/social/farcaster/useFarcasterCurrFid';

import { UserData } from '@/utils/social/farcaster/user-data';
import ModalContainer from '@/components/common/modal/ModalContainer';
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '@/constants/farcaster';

import { FcastTitle2 } from './FCastTitle';
import FCastText from './FCastText';
import { ReplyCast } from './FCastReply';

export default function FCastComment({
  cast,
  farcasterUserDataObj,
  openFarcasterQR,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const [commentCount, setCommentCount] = useState(
    Number(cast.comment_count || cast.repliesCount || 0)
  );
  const currFid: string = useFarcasterCurrFid();
  const [openComment, setOpenComment] = useState(false);
  const { isConnected } = useFarcasterCtx();

  return (
    <>
      <PostReply
        replied={(cast.comments || cast.replies)?.includes(currFid)}
        totalReplies={commentCount}
        replyAction={() => {
          console.log(isLoginU3, isConnected);
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

      <ReplyModal
        openReplyModal={openComment}
        setOpen={setOpenComment}
        cast={cast}
        farcasterUserDataObj={farcasterUserDataObj}
        successCb={() => {
          setCommentCount((pre) => pre + 1);
          setOpenComment(false);
        }}
      />
    </>
  );
}

function ReplyModal({
  openReplyModal,
  setOpen,
  cast,
  farcasterUserDataObj,
  successCb,
}: {
  openReplyModal: boolean;
  setOpen: (open: boolean) => void;
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
  successCb?: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { currFid, isConnected, encryptedSigner, openFarcasterQR } =
    useFarcasterCtx();

  const replyCastAction = useCallback(
    async (data: { cast: CastAddBody; channel: Channel }) => {
      if (!isLoginU3) {
        loginU3();
        return;
      }
      if (!isConnected || !encryptedSigner) {
        openFarcasterQR();
        return;
      }
      // const parentUrl = data.channel?.parent_url || undefined;
      try {
        const castToReply = (
          await makeCastAdd(
            {
              text: data.cast.text,
              embeds: data.cast.embeds || [],
              embedsDeprecated: data.cast.embedsDeprecated || [],
              mentions: data.cast.mentions || [],
              mentionsPositions: data.cast.mentionsPositions || [],
              parentCastId: {
                hash: Buffer.from(cast.hash.data),
                fid: Number(cast.fid),
              },
              // parentUrl,
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(castToReply);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        toast.success('post created');
        if (successCb) successCb();
      } catch (error) {
        console.error(error);
      } finally {
        // setIsPending(false);
      }
    },
    [cast, currFid]
  );

  if (!openReplyModal) return null;
  return (
    <ModalContainer
      open={openReplyModal}
      closeModal={() => {
        setOpen(false);
      }}
      contentTop="40%"
      className="w-full md:w-[600px]"
    >
      <div className="flex flex-col gap-5 p-5 bg-[#1B1E23] text-white border-[#39424C] rounded-xl md:rounded-[20px] md:max-w-none md:w-[600px]">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-2">
            <FcastTitle2
              cast={cast}
              farcasterUserDataObj={farcasterUserDataObj}
            />
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Cross2Icon className="h-5 w-5" />
            </div>
          </div>
          <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
        </div>

        <ReplyCast replyAction={replyCastAction} />
      </div>
    </ModalContainer>
  );
}
