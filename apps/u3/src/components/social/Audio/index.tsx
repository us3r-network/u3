import 'plyr-react/plyr.css';

import type { APITypes } from 'plyr-react';
import Plyr from 'plyr-react';
import { useRef } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';

interface AudioProps extends StyledComponentPropsWithRef<'div'> {
  src: string;
  cover?: string;
}

export default function Audio({ src, cover, ...wrapperProps }: AudioProps) {
  const playerRef = useRef<APITypes>(null);
  return (
    <AudioWrapper {...wrapperProps}>
      {cover && <CoverImage src={cover} />}{' '}
      <Plyr
        ref={playerRef}
        source={{
          type: 'audio',
          sources: [{ src }],
        }}
        options={{
          hideControls: true,
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
          ],
          tooltips: { controls: false },
          volume: 0.5,
        }}
      />
    </AudioWrapper>
  );
}

export const AudioWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background: #14171a;
  overflow: hidden;

  .plyr--audio .plyr__controls {
    background: transparent;
  }
`;
export const CoverImage = styled.img`
  width: 120px;
  height: 120px;
`;
