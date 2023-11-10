import { useEffect, useMemo, useRef, useState } from 'react';
import { PrimaryPublication } from '@lens-protocol/react-web';
import { Player } from '@livepeer/react';
import {
  PostCardAudioWrapper,
  PostCardContentWrapper,
  PostCardImgWrapper,
  PostCardShowMoreWrapper,
  PostCardVideoWrapper,
} from '../PostCard';
import Markup from './Markup';
import ModalImg from '../ModalImg';
import Audio from '../Audio';
import sanitizeDStorageUrl from '../../../utils/social/lens/sanitizeDStorageUrl';
import getPublicationData, {
  MetadataAsset,
} from '../../../utils/social/lens/getPublicationData';

type Props = {
  publication: PrimaryPublication;
  isDetail?: boolean;
};
export default function LensPostCardContent({ publication, isDetail }: Props) {
  const { metadata } = publication || {};
  const publicationData = getPublicationData(metadata);
  const markdownContent = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    () => publicationData?.content || '',
    [publicationData]
  );

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

  const embedImgs = publicationData?.attachments?.filter((m) =>
    m?.type.includes('Image')
  );
  const embedAudio =
    publicationData?.asset?.type === 'Audio' ? publicationData.asset : null;
  const embedVideo =
    publicationData?.asset?.type === 'Video' ? publicationData.asset : null;

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

      {embedAudio && <EmbedAudio asset={embedAudio} />}

      {embedVideo && <EmbedVideo asset={embedVideo} />}
    </>
  );
}

function EmbedImgs({ embedImgs }: { embedImgs: Array<{ uri: string }> }) {
  const [modalImgIdx, setModalImgIdx] = useState(-1);
  return (
    <>
      <PostCardImgWrapper len={embedImgs.length}>
        {embedImgs.map((img, idx) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            src={img.uri}
            alt=""
            key={img.uri}
            onClick={(e) => {
              e.stopPropagation();
              setModalImgIdx(idx);
            }}
          />
        ))}
      </PostCardImgWrapper>
      <ModalImg
        currIdx={modalImgIdx}
        urls={embedImgs.map((item) => item.uri)}
        onAfterClose={() => setModalImgIdx(-1)}
      />
    </>
  );
}

function EmbedAudio({ asset }: { asset: MetadataAsset }) {
  const name = asset?.title || '';
  const author = asset?.artist || '';
  const coverImg = sanitizeDStorageUrl(asset?.cover || '');
  return (
    <PostCardAudioWrapper onClick={(e) => e.stopPropagation()}>
      <Audio src={asset?.uri} cover={coverImg} name={name} author={author} />
    </PostCardAudioWrapper>
  );
}

function EmbedVideo({ asset }: { asset: MetadataAsset }) {
  return (
    <PostCardVideoWrapper onClick={(e) => e.stopPropagation()}>
      <Player
        src={asset?.uri}
        objectFit="contain"
        showLoadingSpinner
        showPipButton={false}
        showUploadingIndicator={false}
        controls={{ defaultVolume: 1 }}
      />
    </PostCardVideoWrapper>
  );
}
