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
  PostCardEmbedWrapper,
  PostCardImgWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../PostCard';
import { getFarcasterEmbedMetadata } from '../../../api/farcaster';

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  openFarcasterQR: () => void;
}) {
  const navigate = useNavigate();

  const castId: CastId = useFarcasterCastId({ cast });
  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData });

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
        if (
          embed.url.endsWith('.png') ||
          embed.url.endsWith('.jpg') ||
          embed.url.endsWith('.jpeg') ||
          embed.url.endsWith('.gif')
        ) {
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

  return (
    <PostCardWrapper
      onClick={() => {
        const id = Buffer.from(castId.hash).toString('hex');
        navigate(`/post-detail/fcast/${id}`);
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
      <PostCardContentWrapper>{cast.text}</PostCardContentWrapper>
      <Embed embedImgs={embeds.imgs} embedWebpages={embeds.webpages} />
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

function Embed({
  embedImgs,
  embedWebpages,
}: {
  embedImgs: { url: string }[];
  embedWebpages: { url: string }[];
}) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [metadata, setMetadata] = useState<
    {
      description: string;
      icon: string;
      image: string;
      title: string;
      url: string;
    }[]
  >([]);

  const getEmbedWebpagesMetadata = async () => {
    const urls = embedWebpages.map((embed) => embed.url);
    if (urls.length === 0) return;
    try {
      const res = await getFarcasterEmbedMetadata(urls);
      const { metadata: respMetadata } = res.data.data;
      const data = respMetadata.flatMap((m) => (m ? [m] : []));
      setMetadata(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  useEffect(() => {
    if (!viewRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        getEmbedWebpagesMetadata();
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
    <div ref={viewRef} onClick={(e) => e.stopPropagation()}>
      {embedImgs && (
        <PostCardImgWrapper>
          {embedImgs.map((img) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={img.url} key={img.url} />
          ))}
        </PostCardImgWrapper>
      )}
      {metadata.map((item) => {
        return (
          <PostCardEmbedWrapper key={item.url} href={item.url} target="_blank">
            <div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div
              className="img"
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            />
          </PostCardEmbedWrapper>
        );
      })}
    </div>
  );
}
