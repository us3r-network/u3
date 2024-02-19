/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { CastId } from '@farcaster/hub-web';
import { ArrowUpIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';

import { UserData } from 'src/utils/social/farcaster/user-data';
import useFarcasterFollowAction from 'src/hooks/social/farcaster/useFarcasterFollowAction';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getSocialDetailShareUrlWithFarcaster } from 'src/utils/shared/share';

import { getOfficialCastUrl } from 'src/utils/social/farcaster/getFarcasterExternalLink';
import { FarCast, SocialPlatform } from '../../../services/social/types';
import useFarcasterUserData from '../../../hooks/social/farcaster/useFarcasterUserData';
import useFarcasterCastId from '../../../hooks/social/farcaster/useFarcasterCastId';
import FCastLike from './FCastLike';
import FCastRecast from './FCastRecast';
import FCastComment from './FCastComment';
import {
  PostCardActionsWrapper,
  PostCardContentWrapper,
  PostCardFooterWrapper,
  PostCardShowMoreWrapper,
  PostCardUserInfo,
  PostCardWrapper,
  PostShareMenuBtn,
} from '../PostCard';
import Embed from '../Embed';
import FarcasterChannel from './FarcasterChannel';
import { PostCardMenuBtn } from '../PostCardMenuBtn';
import { SOCIAL_SHARE_TITLE } from '../../../constants';
import { getEmbeds } from '../../../utils/social/farcaster/getEmbeds';
import FCastText from './FCastText';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pinupCastApi } from '@/services/social/api/farcaster';
import useLogin from '@/hooks/shared/useLogin';
import { SaveButton } from '@/components/shared/button/SaveButton';
import FCastTips from './FCastTips';
import FCastTipDetail from './FCastTipDetail';

export default function FCast({
  cast,
  farcasterUserData,
  farcasterUserDataObj,
  openFarcasterQR,
  isDetail,
  showMenuBtn,
  cardClickAction,
  disableRenderUrl,
  simpleLayout,
  isCommunityLayout,
  ...wrapperProps
}: ComponentPropsWithRef<'div'> & {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
  isDetail?: boolean;
  showMenuBtn?: boolean;
  disableRenderUrl?: boolean;
  simpleLayout?: boolean;
  cardClickAction?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isCommunityLayout?: boolean;
}) {
  const navigate = useNavigate();
  const viewRef = useRef<HTMLDivElement>(null);
  const castId: CastId = useFarcasterCastId({ cast });
  const userData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData,
    farcasterUserDataObj,
  });
  const [count, setCount] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const { following, pinupHashes, updatePinupHashes } = useFarcasterCtx();
  const { followAction, unfollowAction, isPending, isFollowing } =
    useFarcasterFollowAction();
  const { isAdmin } = useLogin();

  const [pinuping, setPinuping] = useState(false);
  const [hasPinup, setHasPinup] = useState(false);

  const pinupAction = useCallback(
    async (unPinup?: boolean) => {
      if (pinuping) return;
      setPinuping(true);
      try {
        await pinupCastApi(
          Buffer.from(cast.hash.data).toString('hex'),
          unPinup
        );
        await updatePinupHashes();
        toast.success(`${unPinup ? 'Unpin' : 'pin'} to top success`);
      } catch (e) {
        console.error(e);
        toast.error(`${unPinup ? 'Unpin' : 'pin'} to top failed`);
      } finally {
        setPinuping(false);
      }
    },
    [pinuping]
  );

  const embeds = useMemo(() => getEmbeds(cast), [cast]);

  useEffect(() => {
    if (isDetail) return;
    if (!viewRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (entry.target.clientHeight > 125 && !simpleLayout) {
          setShowMore(true);
        }

        observer.disconnect();
      }
    });

    observer.observe(viewRef.current);
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, [viewRef]);

  const followed = useMemo(() => {
    if (isFollowing !== undefined) return isFollowing;
    return following.includes(userData.fid);
  }, [isFollowing, following, userData.fid]);

  useEffect(() => {
    if (pinupHashes.has(Buffer.from(cast.hash.data).toString('hex'))) {
      setHasPinup(true);
    } else {
      setHasPinup(false);
    }
  }, [pinupHashes, cast.hash]);

  const [linkParam, setLinkParam] = useState(null);
  useEffect(() => {
    if (isDetail)
      setLinkParam({
        url: getOfficialCastUrl(
          userData.userName,
          Buffer.from(castId.hash).toString('hex')
        ),
        type: 'link',
        title: cast.text.slice(0, 200), // todo: expand this limit at model
      });
  }, [castId.hash, isDetail]);
  return (
    <PostCardWrapper
      id={Buffer.from(cast.hash.data).toString('hex')}
      isDetail={isDetail}
      onClick={(e) => {
        if (isDetail) return;
        const id = Buffer.from(castId.hash).toString('hex');

        cardClickAction?.(e);
        navigate(`/social/post-detail/fcast/${id}`);
      }}
      className={cn(
        '',
        isCommunityLayout
          ? `bg-[#20262F] hover:bg-[#000000] ${
              isDetail ? 'border border-[#20262F]' : ''
            }`
          : ''
      )}
      {...wrapperProps}
    >
      <div className="flex items-center gap-5">
        <PostCardUserInfo
          data={{
            platform: SocialPlatform.Farcaster,
            avatar: userData.pfp,
            name: userData.display,
            handle: userData.userName,
            createdAt: cast.created_at || cast.createdAt,
          }}
        />
        <FCastTipDetail cast={cast} />
        <div className="flex-grow" />
        <div
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FCastTips
            userData={userData}
            cast={cast}
            updateCb={() => {
              setCount(count + 1);
            }}
          />
          {isAdmin && (
            <Button
              className={cn(
                'w-5 h-5 p-0 rounded-full bg-inherit text-white hover:border',
                hasPinup &&
                  'border border-white bg-white text-black hover:bg-white'
              )}
              onClick={() => {
                if (pinuping) return;
                if (hasPinup) pinupAction(true);
                else pinupAction();
              }}
            >
              <ArrowUpIcon />
            </Button>
          )}
        </div>
      </div>

      <PostCardContentWrapper ref={viewRef} showMore={showMore}>
        <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
      </PostCardContentWrapper>
      {showMore && (
        <PostCardShowMoreWrapper>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const id = Buffer.from(castId.hash).toString('hex');
              navigate(`/social/post-detail/fcast/${id}`);
            }}
          >
            Show more
          </button>
        </PostCardShowMoreWrapper>
      )}
      {!simpleLayout && (
        <Embed
          embedImgs={[...embeds.imgs]}
          embedWebpages={!disableRenderUrl ? embeds.webpages : []}
          embedCasts={[...embeds.casts]}
          cast={cast}
        />
      )}
      {(cast.parent_url || cast.rootParentUrl) && (
        <FarcasterChannel url={cast.parent_url || cast.rootParentUrl} />
      )}
      <PostCardFooterWrapper>
        <PostCardActionsWrapper
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FCastLike
            openFarcasterQR={openFarcasterQR}
            cast={cast}
            farcasterUserData={farcasterUserData}
            farcasterUserDataObj={farcasterUserDataObj}
          />
          <FCastComment
            openFarcasterQR={openFarcasterQR}
            cast={cast}
            farcasterUserDataObj={farcasterUserDataObj}
          />
          <FCastRecast
            openFarcasterQR={openFarcasterQR}
            cast={cast}
            farcasterUserDataObj={farcasterUserDataObj}
          />
        </PostCardActionsWrapper>
        {!simpleLayout && (
          <PostCardActionsWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isDetail && <SaveButton linkId={null} link={linkParam} />}
            <PostShareMenuBtn
              offialUrl={getOfficialCastUrl(
                userData.userName,
                Buffer.from(castId.hash).toString('hex')
              )}
              shareLink={getSocialDetailShareUrlWithFarcaster(
                Buffer.from(castId.hash).toString('hex')
              )}
              shareLinkDefaultText={SOCIAL_SHARE_TITLE}
              shareLinkEmbedTitle={cast.text}
              popoverConfig={{ placement: 'top end', offset: 0 }}
            />
          </PostCardActionsWrapper>
        )}
      </PostCardFooterWrapper>
    </PostCardWrapper>
  );
}
