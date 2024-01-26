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
import { PostCardEmbedWrapper, PostCardImgWrapper } from './PostCard';
import {
  getFarcasterEmbedCast,
  getFarcasterEmbedMetadata,
} from '../../services/social/api/farcaster';
import ModalImg from './ModalImg';
import U3ZoraMinter from './farcaster/U3ZoraMinter';
import LinkModal from '../news/links/LinkModal';

export default function Embed({
  embedImgs,
  embedWebpages,
  embedCasts,
}: {
  embedImgs: { url: string }[];
  embedWebpages: { url: string }[];
  embedCasts: { castId: { fid: number; hash: string } }[];
}) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [metadata, setMetadata] = useState<FarCastEmbedMeta[]>([]);
  const [metadataCasts, setMetadataCasts] = useState<FarCastEmbedMetaCast[]>(
    []
  );
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

  const getEmbedCastsMetadata = async () => {
    const castIds = embedCasts.map((embed) => embed.castId);
    if (castIds.length === 0) return;
    try {
      const res = await getFarcasterEmbedCast(castIds[0]);
      const { metadata: respMetadata } = res.data.data;
      const data = respMetadata.flatMap((m) => (m ? [m] : []));
      setMetadataCasts(data);
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
        getEmbedCastsMetadata();
        observer.disconnect();
      }
    });

    observer.observe(viewRef.current);
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, [viewRef]);

  if (
    embedImgs.length === 0 &&
    embedWebpages.length === 0 &&
    embedCasts.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[10px] overflow-hidden" ref={viewRef}>
      {embedImgs.length > 0 && (
        <>
          <PostCardImgWrapper len={embedImgs.length}>
            {embedImgs.map((img, idx) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <img
                className="max-h-[200px] object-cover"
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
      <div className="w-full">
        {[...metadata, ...metadataCasts].map(
          (item: FarCastEmbedMeta | FarCastEmbedMetaCast) => {
            if ((item as any).type === 'cast') {
              if ((item as any).cast === undefined) return null;
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
                <EmbedNFT
                  item={item as FarCastEmbedMeta}
                  key={(item as any).url}
                />
              );
            }
            return (
              <EmbedWebsite
                item={item as FarCastEmbedMeta}
                key={(item as any).url}
              />
            );
          }
        )}
      </div>
    </div>
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
    <div
      className="w-full rounded-[10px] text-[#fff] p-[20px] cursor-pointer flex gap-[10px] justify-between bg-[#14171a]"
      onClick={(e) => {
        e.stopPropagation();
        navigate(
          `/social/post-detail/fcast/${Buffer.from(
            data.cast.hash.data
          ).toString('hex')}`
        );
      }}
    >
      <div className="w-0 flex-1">
        <div className="flex items-center gap-[10px]">
          <img
            className="w-[21px] h-[21px] rounded-[50%] object-cover"
            src={userData.img}
            alt=""
            loading="lazy"
          />
          <div className="flex items-center gap-[5px]">
            <span className="text-[#fff] text-[12px] font-bold mr-[5px] flex-shrink-0">
              {userData.username}
            </span>
            <span className="text-[#718096] text-[12px] font-normal line-clamp-1">
              @{userData.uname}
              {'  '}·{'  '}
              {dayjs(data.cast.created_at).fromNow()}
            </span>
          </div>
        </div>
        <p className="text-[#c8c4c4] mb-0 mt-[10px] p-0 line-clamp-3">
          {data.cast.text}
        </p>
      </div>
      {castImg && (
        <img
          className="flex-shrink-0 w-[100px] h-[100px] rounded-[10px] overflow-hidden object-cover"
          src={castImg}
          alt=""
          loading="lazy"
        />
      )}
    </div>
  );
}

function EmbedNFT({ item }: { item: FarCastEmbedMeta }) {
  if (item.url.startsWith('https://zora.co/collect')) {
    return <U3ZoraMinter url={item.url} embedMetadata={item} />;
  }

  return (
    <div
      className="text-[#fff] w-full rounded-[10px] overflow-hidden bg-[#14171a] [cursor:initial]"
      key={item.url}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <img
        className="w-full max-h-[500px] object-cover"
        src={item.image}
        alt=""
        loading="lazy"
      />
      <div className="flex justify-between items-center p-[20px]">
        <h4 className="m-0 text-[#fff] text-[16px] font-normal leading-[30px]">
          {item.collection}
        </h4>
        <button
          className="cursor-pointer rounded-[10px] bg-[#454c99] px-[20px] py-[10px] border-none outline-[none] text-[#fff] text-[16px] font-bold"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open(item.url, '_blank');
          }}
        >
          View
        </button>
      </div>
    </div>
  );
}

export function EmbedWebsite({
  item,
  cardMode = true,
}: {
  item: FarCastEmbedMeta;
  cardMode?: boolean;
}) {
  if (!item.image && !item.icon) return null;
  const img = item.image || item.icon;
  const [linkModalShow, setLinkModalShow] = useState(false);
  const selectLink = useMemo(() => {
    return {
      url: item.url,
      metadata: item,
    };
  }, [item]);
  return (
    <PostCardEmbedWrapper
      // href={item.url}
      onClick={(e) => e.stopPropagation()}
    >
      {(isImg(img || '') && (
        <div
          className="img w-full max-h-[200px] object-cover"
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
      )) || (
        <div className="img">
          <img
            className="img w-full max-h-[200px] object-cover"
            src={img}
            alt=""
          />
        </div>
      )}
      <div className="flex flex-col gap-[10px] p-[16px] font-[Rubik]">
        <h4 className="text-[#fff] text-[14px] not-italic font-bold leading-[20px]">
          {item.title}
        </h4>
        {item.description && (
          <p
            className={
              cardMode
                ? 'text-[#fff] text-[12px] not-italic font-normal leading-[20px] break-all overflow-ellipsis overflow-hidden line-clamp-2'
                : 'text-[#fff] text-[12px] not-italic font-normal leading-[20px]'
            }
          >
            {item.description}
          </p>
        )}
        <div className="flex justify-between items-center gap-[12px]">
          <a
            className="inline-block flex-1 line-clamp-1 text-[#718096] text-[12px] not-italic font-normal leading-[20px]"
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            {new URL(item.url).host}
          </a>
          {cardMode && (
            <button
              className="cursor-pointer
                          rounded-[10px]
                          bg-[white]
                          p-[10px]
                          border-none
                          outline-[none]
                          text-[#000]
                          text-[14px]
                          not-italic
                          font-bold
                          leading-[normal]
                          w-[100px]
                          flex-shrink-0
                          flex-grow-0"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLinkModalShow(true);
              }}
            >
              Quick View
            </button>
          )}
        </div>
      </div>
      <LinkModal
        show={linkModalShow}
        closeModal={() => {
          setLinkModalShow(false);
        }}
        data={selectLink}
      />
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
