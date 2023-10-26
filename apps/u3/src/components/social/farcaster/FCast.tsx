/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastId } from '@farcaster/hub-web';
import { toast } from 'react-toastify';

import useFarcasterFollowAction from 'src/hooks/farcaster/useFarcasterFollowAction';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
import { tweetShare } from 'src/utils/twitter';
import { getSocialDetailShareUrlWithFarcaster } from 'src/utils/share';

import { FarCast, SocailPlatform } from '../../../api';
import useFarcasterUserData from '../../../hooks/farcaster/useFarcasterUserData';
import useFarcasterCastId from '../../../hooks/farcaster/useFarcasterCastId';
import FCastLike from './FCastLike';
import FCastRecast from './FCastRecast';
import FCastComment from './FCastComment';
import {
  PostCardActionsWrapper,
  PostCardContentWrapper,
  PostCardHeaderWrapper,
  PostCardShowMoreWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../PostCard';
import Embed, { isImg } from '../Embed';
import FarcasterChannel from './FarcasterChannel';
import { PostCardMenuBtn } from '../PostCardMenuBtn';

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
  isDetail,
  showMenuBtn,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  openFarcasterQR: () => void;
  isDetail?: boolean;
  showMenuBtn?: boolean;
}) {
  const navigate = useNavigate();
  const viewRef = useRef<HTMLDivElement>(null);
  const castId: CastId = useFarcasterCastId({ cast });
  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData });
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
        if (entry.target.clientHeight > 125) {
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
      onClick={() => {
        if (isDetail) return;
        const id = Buffer.from(castId.hash).toString('hex');
        navigate(`/social/post-detail/fcast/${id}`);
      }}
    >
      <PostCardHeaderWrapper>
        <PostCardUserInfo
          data={{
            platform: SocailPlatform.Farcaster,
            avatar: userData.pfp,
            name: userData.display,
            handle: userData.userName,
            createdAt: cast.created_at,
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
              shareAction={() => {
                tweetShare(
                  cast.text,
                  getSocialDetailShareUrlWithFarcaster(userData.fid)
                );
              }}
              copyAction={async () => {
                await window.navigator.clipboard.writeText(
                  getSocialDetailShareUrlWithFarcaster(userData.fid)
                );
                toast.success('Copy success');
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
      <Embed embedImgs={[...embeds.imgs]} embedWebpages={embeds.webpages} />
      {cast.parent_url && <FarcasterChannel url={cast.parent_url} />}
      <PostCardActionsWrapper
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <FCastLike
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
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
