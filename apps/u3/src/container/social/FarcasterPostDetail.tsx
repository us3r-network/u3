/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Channelv1 } from '@mod-protocol/farcaster';
import { CastAddBody, makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';

import { getFarcasterCastInfo } from '../../services/social/api/farcaster';
import { FarCast } from '../../services/social/types';
import FCast from '../../components/social/farcaster/FCast';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { PostDetailCommentsWrapper } from '../../components/social/PostDetail';
import Loading from '../../components/common/loading/Loading';

import { scrollToAnchor } from '../../utils/shared/scrollToAnchor';
import { userDataObjFromArr } from '@/utils/social/farcaster/user-data';
import useLogin from '@/hooks/shared/useLogin';

import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '@/constants/farcaster';
import { ReplyCast } from '@/components/social/farcaster/FCastReply';
import { getSocialDetailShareUrlWithFarcaster } from '@/utils/shared/share';
import { getExploreFcPostDetailPath } from '@/route/path';
import { LoadingWrapper } from '@/components/social/CommonStyles';
import { cn } from '@/lib/utils';

export default function FarcasterPostDetail() {
  const navigate = useNavigate();
  const { castId } = useParams();
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState<FarCast>();
  const { currFid, openFarcasterQR, isConnected, encryptedSigner } =
    useFarcasterCtx();
  const { isLogin: isLoginU3, login } = useLogin();
  const [comments, setComments] =
    useState<{ data: FarCast; platform: 'farcaster' }[]>();
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const [mounted, setMounted] = useState(false);

  const loadCastInfo = useCallback(async () => {
    if (!castId) return;
    try {
      const resp = await getFarcasterCastInfo(castId, {});
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const {
        farcasterUserData: farcasterUserDataTmp,
        cast: castTmp,
        comments: commentsTmp,
      } = resp.data.data;

      const userDataObj = userDataObjFromArr(farcasterUserDataTmp);
      setCast(castTmp);
      setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      setComments(commentsTmp);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [castId]);

  const replyCastAction = useCallback(
    async (data: { cast: CastAddBody; channel: Channelv1 }) => {
      if (!isLoginU3) {
        login();
        return;
      }
      if (!isConnected || !encryptedSigner) {
        openFarcasterQR();
        return;
      }

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
              // parentUrl, // parentUrl parentCastId only one of them
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
        loadCastInfo();
      } catch (error) {
        console.error(error);
        toast.error('error creating post');
      } finally {
        // setIsPending(false);
      }
    },
    [cast, loadCastInfo, isLoginU3, isConnected, encryptedSigner]
  );

  useEffect(() => {
    if (!mounted) return;
    const scrollWrapper = document.getElementById('social-scroll-wrapper');
    if (scrollWrapper) scrollWrapper.scrollTop = 0;
    setLoading(true);
    loadCastInfo().finally(() => {
      setLoading(false);
    });
  }, [loadCastInfo, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  if (cast) {
    scrollToAnchor(window.location.hash.split('#')[1]);
    return (
      <div className="w-full">
        <FCast
          isV2Layout
          cast={cast}
          openFarcasterQR={openFarcasterQR}
          farcasterUserData={{}}
          farcasterUserDataObj={farcasterUserDataObj}
          isDetail
          shareLink={getSocialDetailShareUrlWithFarcaster(castId)}
          castClickAction={(e, castHex) => {
            navigate(getExploreFcPostDetailPath(castHex));
          }}
        />
        <div
          className={cn(
            'flex gap-3 w-full mb-2 p-5 border-t border-[#39424c]',
            'max-sm:p-2'
          )}
        >
          <ReplyCast
            replyAction={async (data) => {
              await replyCastAction(data);
            }}
          />
        </div>
        <PostDetailCommentsWrapper>
          {(comments || []).map((item) => {
            const key = Buffer.from(item.data.hash.data).toString('hex');
            return (
              <FCast
                isV2Layout
                key={key}
                cast={item.data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={farcasterUserDataObj}
                shareLink={getSocialDetailShareUrlWithFarcaster(key)}
                castClickAction={(e, castHex) => {
                  navigate(getExploreFcPostDetailPath(castHex));
                }}
              />
            );
          })}
        </PostDetailCommentsWrapper>
      </div>
    );
  }
  return <LoadingWrapper />;
}
