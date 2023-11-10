import { useEffect, useMemo, useRef, useState } from 'react';
import { Player } from '@livepeer/react';
import {
  PostCardAudioWrapper,
  PostCardContentWrapper,
  PostCardImgWrapper,
  PostCardShowMoreWrapper,
  PostCardVideoWrapper,
} from '../../PostCard';
import Markup from '../Markup';
import ModalImg from '../../ModalImg';
import Audio from '../../Audio';
import sanitizeDStorageUrl from '../../../../utils/social/lens/sanitizeDStorageUrl';

type Props = {
  publication: any;
  isDetail?: boolean;
};
export default function LensPostCardContent({ publication, isDetail }: Props) {
  const { metadata } = publication || {};
  const markdownContent = useMemo(() => metadata?.content || '', [metadata]);

  const viewRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
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
  }, [isDetail]);

  const embedImgs =
    metadata?.media?.filter((m) => m?.original?.mimeType?.includes('image')) ||
    [];
  const embedAudios =
    metadata?.media?.filter((m) => m?.original?.mimeType?.includes('audio')) ||
    [];
  const embedVideos =
    metadata?.media?.filter((m) => m?.original?.mimeType?.includes('video')) ||
    [];

  return (
    <>
      <PostCardContentWrapper ref={viewRef} showMore={showMore}>
        <Markup>{markdownContent}</Markup>
      </PostCardContentWrapper>
      {showMore && (
        <PostCardShowMoreWrapper>
          <button type="button">Show more</button>
        </PostCardShowMoreWrapper>
      )}
      {embedImgs.length > 0 && <EmbedImgs embedImgs={embedImgs} />}

      {embedAudios.length > 0 && (
        <EmbedAudio media={embedAudios[0]} publication={publication} />
      )}

      {embedVideos.length > 0 && <EmbedVideo media={embedVideos[0]} />}
    </>
  );
}

function EmbedImgs({ embedImgs }: { embedImgs: any[] }) {
  const [modalImgIdx, setModalImgIdx] = useState(-1);
  return (
    <>
      <PostCardImgWrapper len={embedImgs.length}>
        {embedImgs.map((img, idx) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            src={img.original.url}
            alt=""
            key={img.original.url}
            onClick={(e) => {
              e.stopPropagation();
              setModalImgIdx(idx);
            }}
          />
        ))}
      </PostCardImgWrapper>
      <ModalImg
        currIdx={modalImgIdx}
        urls={embedImgs.map((item) => item.original.url)}
        onAfterClose={() => setModalImgIdx(-1)}
      />
    </>
  );
}

function EmbedAudio({ media, publication }: { media: any; publication: any }) {
  const { metadata } = publication || {};
  const name = metadata?.name || '';
  const author =
    metadata?.attributes.find((attr) => attr.traitType === 'author')?.value ||
    '';
  const coverImg = sanitizeDStorageUrl(
    metadata?.cover?.original?.url ||
      metadata?.image ||
      media.original?.cover ||
      ''
  );
  return (
    <PostCardAudioWrapper onClick={(e) => e.stopPropagation()}>
      <Audio
        src={media.original.url}
        cover={coverImg}
        name={name}
        author={author}
      />
    </PostCardAudioWrapper>
  );
}

function EmbedVideo({ media }: { media: any }) {
  return (
    <PostCardVideoWrapper onClick={(e) => e.stopPropagation()}>
      <Player
        src={media.original.url}
        objectFit="contain"
        showLoadingSpinner
        showPipButton={false}
        showUploadingIndicator={false}
        controls={{ defaultVolume: 1 }}
      />
    </PostCardVideoWrapper>
  );
}
