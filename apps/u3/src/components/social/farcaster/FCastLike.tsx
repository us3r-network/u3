/* eslint-disable @typescript-eslint/no-shadow */
import { CastId } from '@farcaster/hub-web';
import { UserData } from 'src/utils/social/farcaster/user-data';

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
import useFarcasterLikeAction from '@/hooks/social/farcaster/useFarcasterLikeAction';

export default function FCastLike({
  cast,
  farcasterUserData,
  farcasterUserDataObj,
  openFarcasterQR,
  onLikeSuccess,
  onRemoveLikeSuccess,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
  onLikeSuccess?: () => void;
  onRemoveLikeSuccess?: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { isConnected } = useFarcasterCtx();

  const { likes, likeCount, likeCast, removeLikeCast, liked } =
    useFarcasterLikeAction({ cast, onLikeSuccess, onRemoveLikeSuccess });

  const castId: CastId = useFarcasterCastId({ cast });

  return (
    <PostLikeWrapper>
      {/* {likes.length > 0 && (
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
      )} */}
      <PostLike
        totalLikes={likeCount}
        liked={liked}
        likeAction={() => {
          if (!isLoginU3) {
            loginU3();
            return;
          }
          if (!isConnected) {
            openFarcasterQR();
            return;
          }
          if (liked) {
            removeLikeCast(castId);
          } else {
            likeCast(castId);
          }
        }}
      />
    </PostLikeWrapper>
  );
}

// function LikeAvatar({
//   farcasterUserData,
//   farcasterUserDataObj,
//   fid,
// }: {
//   fid: string;
//   farcasterUserData: { [key: string]: { type: number; value: string }[] };
//   farcasterUserDataObj?: { [key: string]: UserData } | undefined;
// }) {
//   const userData = useFarcasterUserData({
//     fid,
//     farcasterUserData,
//     farcasterUserDataObj,
//   });
//   if (userData.pfp) {
//     return (
//       <PostLikeAvatarWrapper>
//         <PostLikeAvatar src={userData.pfp} alt="" />
//       </PostLikeAvatarWrapper>
//     );
//   }
//   if (userData.display) {
//     return <PostLikeAvatarWrapper>{userData.display}</PostLikeAvatarWrapper>;
//   }
//   return <PostLikeAvatarWrapper>{userData.fid}</PostLikeAvatarWrapper>;
// }
