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
  PostCardMainWrapper,
  PostCardPlatformInfo,
  PostCardShowMoreWrapper,
  PostCardUserInfo,
  PostCardUserInfoV2,
  PostCardWrapper,
  PostCardWrapperV2,
  PostShareMenuBtn,
} from '../PostCard';
import Embed from '../Embed';
import FarcasterChannel from './FarcasterChannel';
import { SOCIAL_SHARE_TITLE } from '../../../constants';
import { getEmbeds } from '../../../utils/social/farcaster/getEmbeds';
import FCastText from './FCastText';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pinupCastApi } from '@/services/social/api/farcaster';
import useLogin from '@/hooks/shared/useLogin';
import { SaveButton, formatLink } from '@/components/shared/button/SaveButton';
import FCastTips from './FCastTips';
import FCastTipDetail from './FCastTipDetail';
import FCastSuperLike from './FCastSuperLike';
import { useLinkId } from '@/hooks/shared/useLinkId';
import FCastTrade from './FCastTrade';

const DEGEN_FID = 5557;
export default function FCast({
  cast,
  farcasterUserData,
  farcasterUserDataObj,
  openFarcasterQR,
  isDetail,
  showMenuBtn,
  cardClickAction,
  castClickAction,
  disableRenderUrl,
  simpleLayout,
  isV2Layout,
  shareLink,
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
  castClickAction?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    castHex: string
  ) => void;
  isV2Layout?: boolean;
  shareLink?: string;
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
  const { following, pinupHashes, updatePinupHashes, currFid } =
    useFarcasterCtx();
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
    setLinkParam({
      url: getOfficialCastUrl(
        userData.userName,
        Buffer.from(castId.hash).toString('hex')
      ),
      type: 'link',
      title: cast.text.slice(0, 200), // todo: expand this limit at model
    });
  }, [castId.hash]);

  const [updatedCast, setUpdatedCast] = useState(cast);
  const changeCastLikesWithCurrFid = (liked: boolean) => {
    let likes = cast.likes || [];
    let likesCount = Number(cast.likesCount) || 0;
    const fid = String(currFid);
    if (liked) {
      likes.push(fid);
      likesCount += 1;
    } else {
      likes = likes.filter((id) => id !== fid);
      likesCount -= 1;
    }
    setUpdatedCast({
      ...cast,
      likes,
      likesCount: String(likesCount),
    });
  };
  const changeCastRecastsWithCurrFid = (recasted: boolean) => {
    let recasts = cast.recasts || [];
    let recastsCount = Number(cast.recastsCount) || 0;
    const fid = String(currFid);
    if (recasted) {
      recasts.push(fid);
      recastsCount += 1;
    } else {
      recasts = recasts.filter((id) => id !== fid);
      recastsCount -= 1;
    }
    setUpdatedCast({
      ...cast,
      recasts,
      recastsCount: String(recastsCount),
    });
  };
  const formatLinkParam = formatLink(linkParam);
  const { getLinkId, linkId, setLinkId } = useLinkId(formatLinkParam);

  /**
   * 注：这里是区分v2版本布局，在这里兼容v2是为了保证功能一致改动时方便
   * //TODO 等正式使用v2版本后，删除这个判断，然后删除下面旧的布局
   */
  if (isV2Layout) {
    const castHex = Buffer.from(castId.hash).toString('hex');
    return (
      <PostCardWrapperV2
        id={castHex}
        isDetail={isDetail}
        onClick={(e) => {
          if (isDetail) return;
          castClickAction?.(e, castHex);
        }}
        {...wrapperProps}
      >
        {!simpleLayout && (
          <div className="flex w-[50px] p-[10px] box-border flex-col items-center gap-[10px] self-stretch">
            <FCastSuperLike
              openFarcasterQR={openFarcasterQR}
              cast={updatedCast}
              linkId={linkId}
              link={formatLinkParam}
              onSaveSuccess={(newLinkId) => {
                setLinkId(newLinkId);
              }}
              onLikeSuccess={() => {
                changeCastLikesWithCurrFid(true);
              }}
              onRecastSuccess={() => {
                changeCastRecastsWithCurrFid(true);
              }}
            />
            <FCastTipDetail cast={cast} isV2Layout />
          </div>
        )}

        <PostCardMainWrapper>
          <div className="flex items-center gap-[5px]">
            <PostCardUserInfoV2
              data={{
                platform: SocialPlatform.Farcaster,
                avatar: userData.pfp,
                name: userData.display,
                handle: userData.userName,
                createdAt: cast.created_at || cast.createdAt,
              }}
            />
            {(cast.parent_url || cast.rootParentUrl) && (
              <FarcasterChannel
                url={cast.parent_url || cast.rootParentUrl}
                isV2Layout
              />
            )}
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
            <FCastText
              cast={cast}
              farcasterUserDataObj={farcasterUserDataObj}
            />
          </PostCardContentWrapper>
          {showMore && (
            <PostCardShowMoreWrapper>
              <div
                onClick={(e: any) => {
                  e.stopPropagation();
                  castClickAction?.(e, castHex);
                }}
              >
                <button type="button">Show more</button>
              </div>
            </PostCardShowMoreWrapper>
          )}
          {!simpleLayout && (
            <Embed
              embedImgs={[...embeds.imgs]}
              embedWebpages={!disableRenderUrl ? embeds.webpages : []}
              embedCasts={[...embeds.casts]}
              cast={cast}
              embedCastClick={(e, embedCastHex) => {
                castClickAction?.(e, embedCastHex);
              }}
            />
          )}
          {cast?.mentions?.includes(DEGEN_FID) && <FCastTrade />}
          <PostCardFooterWrapper>
            <PostCardPlatformInfo platform={SocialPlatform.Farcaster} />
            <PostCardActionsWrapper
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {!simpleLayout && (
                <>
                  <PostCardActionsWrapper
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <SaveButton
                      linkId={linkId}
                      link={linkParam}
                      onSuccessfullyFavor={(isFavored) => {
                        if (!linkId && linkParam?.url && linkParam?.type) {
                          getLinkId(linkParam).then((id) => {
                            if (id) setLinkId(id);
                            else setLinkId('');
                          });
                        }
                      }}
                    />
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
                  <div className="w-[1px] h-[16px] bg-[#39424C]" />
                </>
              )}

              <FCastLike
                openFarcasterQR={openFarcasterQR}
                cast={updatedCast}
                farcasterUserData={farcasterUserData}
                farcasterUserDataObj={farcasterUserDataObj}
                onLikeSuccess={() => {
                  changeCastLikesWithCurrFid(true);
                }}
                onRemoveLikeSuccess={() => {
                  changeCastLikesWithCurrFid(false);
                }}
              />
              <FCastComment
                openFarcasterQR={openFarcasterQR}
                cast={updatedCast}
                farcasterUserDataObj={farcasterUserDataObj}
              />
              <FCastRecast
                openFarcasterQR={openFarcasterQR}
                cast={updatedCast}
                farcasterUserDataObj={farcasterUserDataObj}
                onRecastSuccess={() => {
                  changeCastRecastsWithCurrFid(true);
                }}
                onRemoveRecastSuccess={() => {
                  changeCastRecastsWithCurrFid(false);
                }}
              />
            </PostCardActionsWrapper>
          </PostCardFooterWrapper>
        </PostCardMainWrapper>
      </PostCardWrapperV2>
    );
  }
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
          embedCastClick={(e, embedCastHex) => {
            navigate(`/social/post-detail/fcast/${embedCastHex}`);
          }}
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
