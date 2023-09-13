/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastId, UserDataType } from '@farcaster/hub-web';
import styled from 'styled-components';
import dayjs from 'dayjs';

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
  PostCardShowMoreWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../PostCard';
import { getFarcasterEmbedMetadata } from '../../../api/farcaster';

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
  openImgModal,
  isDetail,
}: {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  openFarcasterQR: () => void;
  openImgModal: (url: string) => void;
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
      <Embed
        embedImgs={embeds.imgs}
        embedWebpages={embeds.webpages}
        openImgModal={openImgModal}
      />
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

function Embed({
  embedImgs,
  embedWebpages,
  openImgModal,
}: {
  embedImgs: { url: string }[];
  embedWebpages: { url: string }[];
  openImgModal: (url: string) => void;
}) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [metadata, setMetadata] = useState<
    (FarCastEmbedMeta | FarCastEmbedMetaCast)[]
  >([]);

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
        <PostCardImgWrapper>
          {embedImgs.map((img) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <img
              src={img.url}
              alt=""
              key={img.url}
              onClick={(e) => {
                e.stopPropagation();
                openImgModal(img.url);
              }}
            />
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
    return img;
  }, [data.cast]);

  if (!castImg) return null;

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
          <img src={userData.img} alt="" />
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
      {castImg && <img src={castImg} alt="" />}
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

function EmbedWebsite({ item }: { item: FarCastEmbedMeta }) {
  if (!item.image) return null;
  return (
    <PostCardEmbedWrapper href={item.url} target="_blank">
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
      <div className="intro">
        <h4>{item.title}</h4>
        {item.description && <p>{item.description}</p>}
        <span>{new URL(item.url).host}</span>
      </div>
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
