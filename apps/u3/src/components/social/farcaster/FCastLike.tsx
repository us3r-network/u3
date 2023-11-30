/* eslint-disable @typescript-eslint/no-shadow */
import {
  CastId,
  ReactionType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { UserData } from 'src/utils/social/farcaster/user-data';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../../constants/farcaster';
import useFarcasterUserData from '../../../hooks/social/farcaster/useFarcasterUserData';
import useFarcasterCastId from '../../../hooks/social/farcaster/useFarcasterCastId';
// import { getCurrFid } from '../../../utils/farsign-utils';
import PostLike, {
  PostLikeAvatar,
  PostLikeAvatarWrapper,
  PostLikeAvatarsWrapper,
  PostLikeWrapper,
} from '../PostLike';
import { FarCast } from '../../../services/social/types';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import useLogin from '../../../hooks/shared/useLogin';

export default function FCastLike({
  cast,
  farcasterUserData,
  farcasterUserDataObj,
  openFarcasterQR,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { encryptedSigner, isConnected, currFid } = useFarcasterCtx();
  const [likes, setLikes] = useState<string[]>(Array.from(new Set(cast.likes)));
  const [likeCount, setLikeCount] = useState<number>(
    Number(cast.like_count || cast.likesCount || 0)
  );

  const likeCast = useCallback(
    async (castId: CastId) => {
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) {
        console.error('no encryptedSigner');
        return;
      }
      try {
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

        toast.success('like post created');
      } catch (error) {
        console.error(error);
        toast.error('error like');
      }
    },
    [encryptedSigner, isConnected, likeCount, likes, openFarcasterQR, currFid]
  );

  const removeLikeCast = useCallback(
    async (castId: CastId) => {
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      // const currFid = getCurrFid();
      try {
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

        toast.success('like post removed');
      } catch (error) {
        toast.error('error like');
      }
    },
    [encryptedSigner, isConnected, likeCount, likes, openFarcasterQR, currFid]
  );

  const castId: CastId = useFarcasterCastId({ cast });

  return (
    <PostLikeWrapper>
      {likes.length > 0 && (
        <PostLikeAvatarsWrapper>
          {likes.slice(0, 3).map((item) => {
            return (
              <LikeAvatar
                key={item}
                fid={item}
                farcasterUserData={farcasterUserData}
                farcasterUserDataObj={farcasterUserDataObj}
              />
            );
          })}
          {likes.length > 3 && (
            <PostLikeAvatarWrapper>+{likes.length - 3}</PostLikeAvatarWrapper>
          )}
        </PostLikeAvatarsWrapper>
      )}
      <PostLike
        totalLikes={likeCount}
        liked={likes.includes(`${currFid}`)}
        likeAction={() => {
          if (!isLoginU3) {
            loginU3();
            return;
          }
          if (likes.includes(`${currFid}`)) {
            removeLikeCast(castId);
          } else {
            likeCast(castId);
          }
        }}
      />
    </PostLikeWrapper>
  );
}

function LikeAvatar({
  farcasterUserData,
  farcasterUserDataObj,
  fid,
}: {
  fid: string;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
}) {
  const userData = useFarcasterUserData({
    fid,
    farcasterUserData,
    farcasterUserDataObj,
  });
  if (userData.pfp) {
    return (
      <PostLikeAvatarWrapper>
        <PostLikeAvatar src={userData.pfp} alt="" />
      </PostLikeAvatarWrapper>
    );
  }
  if (userData.display) {
    return <PostLikeAvatarWrapper>{userData.display}</PostLikeAvatarWrapper>;
  }
  return <PostLikeAvatarWrapper>{userData.fid}</PostLikeAvatarWrapper>;
}
