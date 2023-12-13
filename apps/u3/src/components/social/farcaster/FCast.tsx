/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CastId } from '@farcaster/hub-web';
import isURL from 'validator/lib/isURL';

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
import Embed from '../Embed';
import FarcasterChannel from './FarcasterChannel';
import { PostCardMenuBtn } from '../PostCardMenuBtn';
import { SOCIAL_SHARE_TITLE } from '../../../constants';
import { getEmbeds } from '../../../utils/social/farcaster/getEmbeds';
import { farcasterHandleToBioLinkHandle } from '@/utils/profile/biolink';

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
        <CardText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
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
            farcasterUserDataObj={farcasterUserDataObj}
          />
          <FCastRecast openFarcasterQR={openFarcasterQR} cast={cast} />
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

function CardText({
  cast,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
}) {
  const t = useMemo(() => {
    const { text, mentions, mentionsPositions: indices } = cast;
    const segments = splitAndInsert(
      text,
      indices || [],
      (mentions || []).map((mention, index) => {
        const mentionData = farcasterUserDataObj?.[mention];
        if (!mentionData) return null;
        const profileIdentity = mentionData.userName.endsWith('.eth')
          ? mentionData.userName
          : farcasterHandleToBioLinkHandle(mentionData.userName);
        const link = (
          <Link
            to={`/u/${profileIdentity}`}
            key={index}
            className="inline text-main-accent hover:cursor-pointer hover:underline"
          >
            {`@${mentionData.userName}`}
          </Link>
        );
        return (
          <span className="override-nav inline-block" key={index}>
            {link}
          </span>
        );
      }),
      (s, index) => {
        return (
          <span className="inline" key={index}>
            {s.split(/(\s|\n)/).map((part, index_) => {
              if (isURL(part, { require_protocol: false })) {
                const link = !(
                  part.toLowerCase().startsWith('https://') ||
                  part.toLowerCase().startsWith('http://')
                )
                  ? `https://${part}`
                  : part;
                return (
                  <a
                    href={link}
                    key={index_}
                    target="_blank"
                    rel="noreferrer"
                    className="inline text-main-accent hover:cursor-pointer hover:underline"
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </span>
        );
      }
    );
    return segments;
  }, [cast, farcasterUserDataObj]);

  return (
    <div
      onClick={(e) => {
        if (e.target instanceof HTMLAnchorElement) {
          e.stopPropagation();
        }
      }}
    >
      {t}
    </div>
  );
}

function splitAndInsert(
  input: string,
  indices: number[],
  insertions: JSX.Element[],
  elementBuilder: (s: string, key: any) => JSX.Element
) {
  const result = [];
  let lastIndex = 0;

  indices.forEach((index, i) => {
    result.push(
      elementBuilder(
        Buffer.from(input).slice(lastIndex, index).toString(),
        `el-${i}`
      )
    );
    result.push(insertions[i]);
    lastIndex = index;
  });

  result.push(
    elementBuilder(
      Buffer.from(input).slice(lastIndex).toString(),
      `el-${indices.length}`
    )
  ); // get remaining part of string

  return result;
}
