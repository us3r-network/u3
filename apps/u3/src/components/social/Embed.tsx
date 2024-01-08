/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataType } from '@farcaster/hub-web';
import styled from 'styled-components';
import dayjs from 'dayjs';

import {
  FarCastEmbedMeta,
  FarCastEmbedMetaCast,
} from '../../services/social/types';
import {
  PostCardCastWrapper,
  PostCardEmbedWrapper,
  PostCardImgWrapper,
  PostCardNftWrapper,
} from './PostCard';
import { getFarcasterEmbedMetadata } from '../../services/social/api/farcaster';
import ModalImg from './ModalImg';
import U3ZoraMinter from './farcaster/U3ZoraMinter';

export default function Embed({
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
  const [modalImgIdx, setModalImgIdx] = useState(-1);

  const getEmbedWebpagesMetadata = async () => {
    const urls = embedWebpages.map((embed) => embed.url);
    if (urls.length === 0) return;
    try {
      const res = await getFarcasterEmbedMetadata([urls[0]]);
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

  if (embedImgs.length === 0 && embedWebpages.length === 0) return null;

  return (
    <EmbedBox ref={viewRef}>
      {embedImgs.length > 0 && (
        <>
          <PostCardImgWrapper len={embedImgs.length}>
            {embedImgs.map((img, idx) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <img
                src={img.url}
                alt=""
                loading="lazy"
                key={img.url}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImgIdx(idx);
                }}
              />
            ))}
          </PostCardImgWrapper>
          <ModalImg
            currIdx={modalImgIdx}
            urls={embedImgs.map((item) => item.url)}
            onAfterClose={() => setModalImgIdx(-1)}
          />
        </>
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
          <EmbedWebsite
            item={item as FarCastEmbedMeta}
            key={(item as any).url}
          />
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
    const uname = data.user.find(
      (u) => u.type === UserDataType.USERNAME
    )?.value;

    return {
      img,
      username,
      uname,
    };
  }, [data.user]);

  const castImg = useMemo(() => {
    const img = data.cast.embeds.find((item) => isImg(item?.url))?.url;
    return img as string;
  }, [data.cast]);

  return (
    <PostCardCastWrapper
      onClick={(e) => {
        e.stopPropagation();
        navigate(
          `/social/post-detail/fcast/${Buffer.from(
            data.cast.hash.data
          ).toString('hex')}`
        );
      }}
    >
      <div>
        <div>
          <img
            src={userData.img}
            alt=""
            loading="lazy"
            className="object-cover"
          />
          <div>
            <span className="username">{userData.username}</span>
            <span className="uname">
              @{userData.uname}
              {'  '}·{'  '}
              {dayjs(data.cast.created_at).fromNow()}
            </span>
          </div>
        </div>
        <p>{data.cast.text}</p>
      </div>
      {castImg && <img src={castImg} alt="" loading="lazy" />}
    </PostCardCastWrapper>
  );
}

function EmbedNFT({ item }: { item: FarCastEmbedMeta }) {
  if (item.url.startsWith('https://zora.co/collect')) {
    return <U3ZoraMinter url={item.url} embedMetadata={item} />;
  }

  return (
    <PostCardNftWrapper
      key={item.url}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <img src={item.image} alt="" loading="lazy" />
      <div>
        <h4>{item.collection}</h4>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open(item.url, '_blank');
          }}
        >
          View
        </button>
      </div>
    </PostCardNftWrapper>
  );
}

export function EmbedWebsite({ item }: { item: FarCastEmbedMeta }) {
  if (!item.image && !item.icon) return null;
  const img = item.image || item.icon;
  return (
    <PostCardEmbedWrapper
      href={item.url}
      target="_blank"
      onClick={(e) => e.stopPropagation()}
    >
      {(isImg(img || '') && (
        <div
          className="img"
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
      )) || (
        <div className="img">
          <img src={img} alt="" />
        </div>
      )}
      <div className="intro">
        <h4>{item.title}</h4>
        {item.description && <p>{item.description}</p>}
        <div>
          <span>{new URL(item.url).host}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(item.url, '_blank');
            }}
          >
            Quick View
          </button>
        </div>
      </div>
    </PostCardEmbedWrapper>
  );
}

export function isImg(url?: string) {
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
