/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastId } from '@farcaster/hub-web';

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
  PostCardHeaderWrapper,
  PostCardShowMoreWrapper,
  PostCardUserInfo,
  PostCardWrapper,
  PostShareMenuBtn,
} from '../PostCard';
import Embed, { isImg } from '../Embed';
import FarcasterChannel from './FarcasterChannel';
import { PostCardMenuBtn } from '../PostCardMenuBtn';
import { SOCIAL_SHARE_TITLE } from '../../../constants';

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
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
  isDetail?: boolean;
  showMenuBtn?: boolean;
  disableRenderUrl?: boolean;
  simpleLayout?: boolean;
  cardClickAction?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const navigate = useNavigate();
  const viewRef = useRef<HTMLDivElement>(null);
  const castId: CastId = useFarcasterCastId({ cast });
  const userData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData,
    farcasterUserDataObj,
  });
  const [showMore, setShowMore] = useState(false);
  const { following } = useFarcasterCtx();
  const { followAction, unfollowAction, isPending, isFollowing } =
    useFarcasterFollowAction();

  const embeds: {
    imgs: {
      url: string;
    }[];
    webpages: {
      url: string;
    }[];
  } = useMemo(() => {
    const imgs = [];
    const webpages = [];
    for (const embed of cast.embeds) {
      if (embed?.url) {
        if (isImg(embed.url)) {
          imgs.push({
            url: embed.url,
          });
        } else {
          webpages.push({
            url: embed.url,
          });
        }
      }
    }
    return { imgs, webpages };
  }, [cast]);

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
    >
      <PostCardHeaderWrapper>
        <PostCardUserInfo
          data={{
            platform: SocialPlatform.Farcaster,
            avatar: userData.pfp,
            name: userData.display,
            handle: userData.userName,
            createdAt: cast.created_at || cast.createdAt,
          }}
        />
        {showMenuBtn && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PostCardMenuBtn
              data={{
                name: userData.display,
                handle: userData.userName,
              }}
              isFollowed={followed}
              followPending={isPending}
              unfollowPending={isPending}
              followAction={() => {
                if (followed) {
                  unfollowAction(userData.fid);
                } else {
                  followAction(userData.fid);
                }
              }}
            />
          </div>
        )}
      </PostCardHeaderWrapper>

      <PostCardContentWrapper ref={viewRef} showMore={showMore}>
        <CardText text={cast.text} />
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
            farcasterUserData={farcasterUserData}
          />
          <FCastRecast
            openFarcasterQR={openFarcasterQR}
            cast={cast}
            farcasterUserData={farcasterUserData}
          />
        </PostCardActionsWrapper>
        {!simpleLayout && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
          </div>
        )}
      </PostCardFooterWrapper>
    </PostCardWrapper>
  );
}

function CardText({ text }: { text: string }) {
  const t = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function a(url) {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  }, [text]);

  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: t }}
      onClick={(e) => {
        if (e.target instanceof HTMLAnchorElement) {
          e.stopPropagation();
        }
      }}
    />
  );
}
