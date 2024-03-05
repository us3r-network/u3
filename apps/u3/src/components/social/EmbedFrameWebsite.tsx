import { useEffect, useRef, useState } from 'react';
import { Frame } from 'frames.js';
import { FarCast } from '@/services/social/types';
import { getFarcasterEmbedMetadataV2 } from '../../services/social/api/farcaster';
import EmbedCastFrame from './EmbedFrame';
import EmbedOG from './EmbedOG';

export default function EmbedFrameWebsite({
  url,
  cast,
}: {
  url: string;
  cast: FarCast;
}) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<Frame>();
  const [og, setOG] = useState<any>();
  const getEmbedWebpagesMetadata = async () => {
    try {
      const res = await getFarcasterEmbedMetadataV2([url]);
      const { metadata: respMetadata } = res.data.data;
      if (!respMetadata || !respMetadata[0]) return;

      const { ogData, frame: frameData } = respMetadata[0];
      if (frameData && frameData.version) {
        setFrame(frameData);
      } else {
        setOG(ogData);
      }
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
    <div ref={viewRef}>
      {frame && <EmbedCastFrame url={url} data={frame} cast={cast} />}
      {og && <EmbedOG url={url} data={og} />}
    </div>
  );
}
