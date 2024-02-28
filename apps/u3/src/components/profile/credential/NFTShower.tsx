import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

export default function NFTShower({
  url,
  ipfs,
  calcHeight,
}: {
  url: string;
  ipfs?: boolean;
  calcHeight?: boolean;
}) {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [contentType, setContentType] = useState('');

  const attemptPlay = () => {
    if (videoEl && videoEl.current) {
      videoEl.current.play().catch((error) => {
        console.error('Error attempting to play', error);
      });
    }
  };

  const imageErrCheck = useCallback(async (imageUrl: string) => {
    if (!imageUrl) return;
    try {
      const resp = await axios.get(imageUrl);
      setContentType(resp.headers['content-type']);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    attemptPlay();
  }, [contentType]);

  const img = useMemo(() => {
    if (ipfs) {
      if (url) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      return url;
    }
    return url;
  }, [url, ipfs]);

  if (img.endsWith('mp4') || contentType.startsWith('video')) {
    return (
      <Box calcHeight={!!calcHeight}>
        <video src={img} autoPlay muted loop ref={videoEl} />
      </Box>
    );
  }

  if (!img) {
    return null;
  }

  return (
    <Box calcHeight={!!calcHeight}>
      <img
        src={img}
        alt=""
        onError={() => {
          imageErrCheck(img);
        }}
      />
    </Box>
  );
}

const Box = styled.div<{ calcHeight: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #333;
  color: #fff;
  line-height: 100%;
  height: ${(props) => (props.calcHeight ? 'calc(100% - 60px)' : '100%')};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
