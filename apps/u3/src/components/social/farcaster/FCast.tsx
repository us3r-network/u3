/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastId, UserDataType } from '@farcaster/hub-web';
import styled from 'styled-components';

import {
  FarCast,
  FarCastEmbedMeta,
  FarCastEmbedMetaCast,
  SocailPlatform,
} from '../../../api';
import useFarcasterUserData from '../../../hooks/farcaster/useFarcasterUserData';
import useFarcasterCastId from '../../../hooks/farcaster/useFarcasterCastId';
import FCastLike from './FCastLike';
import FCastRecast from './FCastRecast';
import FCastComment from './FCastComment';
import {
  PostCardActionsWrapper,
  PostCardCastWrapper,
  PostCardContentWrapper,
  PostCardEmbedWrapper,
  PostCardImgWrapper,
  PostCardNftWrapper,
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
    (FarCastEmbedMeta | FarCastEmbedMetaCast)[]
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
    <EmbedBox ref={viewRef} onClick={(e) => e.stopPropagation()}>
      {embedImgs.length > 0 && (
        <PostCardImgWrapper>
          {embedImgs.map((img) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={img.url} key={img.url} />
          ))}
        </PostCardImgWrapper>
      )}
      {metadata.map((item: FarCastEmbedMeta | FarCastEmbedMetaCast) => {
        if ((item as any).type === 'cast') {
          const { cast } = item as FarCastEmbedMetaCast;
          return (
            <EmbedCast
              data={item as FarCastEmbedMetaCast}
              key={Buffer.from(cast.hash.data).toString('hex')}
            />
          );
        }
        if ((item as any).collection) {
          return (
            <EmbedNFT item={item as FarCastEmbedMeta} key={(item as any).url} />
          );
        }
        return (
          <EmbedImg item={item as FarCastEmbedMeta} key={(item as any).url} />
        );
      })}
    </EmbedBox>
  );
}

function EmbedCast({ data }: { data: FarCastEmbedMetaCast }) {
  const navigate = useNavigate();

  const userData = useMemo(() => {
    const img = data.user.find((u) => u.type === UserDataType.PFP)?.value;
    const username = data.user.find(
      (u) => u.type === UserDataType.DISPLAY
    )?.value;

    return {
      img,
      username,
    };
  }, [data.user]);

  return (
    <PostCardCastWrapper
      onClick={(e) => {
        e.stopPropagation();
        navigate(
          `/post-detail/fcast/${Buffer.from(data.cast.hash.data).toString(
            'hex'
          )}`
        );
      }}
    >
      <div>
        <img src={userData.img} alt="" />
        <span>{userData.username}</span>
      </div>
      <p>{data.cast.text}</p>
    </PostCardCastWrapper>
  );
}

function EmbedNFT({ item }: { item: FarCastEmbedMeta }) {
  // const { setIframeUrl } = useFarcasterCtx();
  return (
    <PostCardNftWrapper key={item.url}>
      <img src={item.image} alt="" />
      <div>
        <h4>{item.collection}</h4>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            // if (item.url.includes('zora.co')) {
            //   setIframeUrl(item.url);
            // } else {
            window.open(item.url, '_blank');
            // }
          }}
        >
          Mint
        </button>
      </div>
    </PostCardNftWrapper>
  );
}

function EmbedImg({ item }: { item: FarCastEmbedMeta }) {
  return (
    <PostCardEmbedWrapper href={item.url} target="_blank">
      <div>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
      {(isImg(item.image || '') && (
        <div
          className="img"
          style={{
            backgroundImage: `url(${item.image})`,
          }}
        />
      )) || (
        <div className="img">
          <img src={item.image} alt="" />
        </div>
      )}
    </PostCardEmbedWrapper>
  );
}

function isImg(url?: string) {
  if (!url) return false;
  return (
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.gif')
  );
}

const EmbedBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
