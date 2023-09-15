/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastId } from '@farcaster/hub-web';

import { FarCast, SocailPlatform } from '../../../api';
import useFarcasterUserData from '../../../hooks/farcaster/useFarcasterUserData';
import useFarcasterCastId from '../../../hooks/farcaster/useFarcasterCastId';
import FCastLike from './FCastLike';
import FCastRecast from './FCastRecast';
import FCastComment from './FCastComment';
import {
  PostCardActionsWrapper,
  PostCardContentWrapper,
  PostCardShowMoreWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../PostCard';
import Embed, { isImg } from '../Embed';

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
  isDetail,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  openFarcasterQR: () => void;
  isDetail?: boolean;
}) {
  const navigate = useNavigate();
  const viewRef = useRef<HTMLDivElement>(null);
  const castId: CastId = useFarcasterCastId({ cast });
  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData });
  const [showMore, setShowMore] = useState(false);

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

  return (
    <PostCardWrapper
      isDetail={isDetail}
      onClick={() => {
        if (isDetail) return;
        const id = Buffer.from(castId.hash).toString('hex');
        navigate(`/social/post-detail/fcast/${id}`);
      }}
    >
      <PostCardUserInfo
        data={{
          platform: SocailPlatform.Farcaster,
          avatar: userData.pfp,
          name: userData.display,
          handle: userData.userName,
          createdAt: cast.created_at,
        }}
      />

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
