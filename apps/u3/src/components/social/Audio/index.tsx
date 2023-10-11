import 'plyr-react/plyr.css';

import type { APITypes } from 'plyr-react';
import Plyr from 'plyr-react';
import { useRef } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';

interface AudioProps extends StyledComponentPropsWithRef<'div'> {
  src: string;
  name: string;
  author: string;
  cover?: string;
}

export default function Audio({
  src,
  name,
  author,
  cover,
  ...wrapperProps
}: AudioProps) {
  const playerRef = useRef<APITypes>(null);
  return (
    <AudioWrapper {...wrapperProps}>
      {cover && <CoverImage src={cover} />}{' '}
      <PlyrWrapper>
        {name && <Name>{name}</Name>}
        {author && <Author>{author}</Author>}
        <Plyr
          ref={playerRef}
          source={{
            type: 'audio',
            sources: [{ src }],
          }}
          options={{
            hideControls: true,
            controls: ['play', 'current-time', 'mute', 'volume'],
            tooltips: { controls: false },
            volume: 0.1,
          }}
        />
      </PlyrWrapper>
    </AudioWrapper>
  );
}

const AudioWrapper = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background: #14171a;
  overflow: hidden;
`;
const PlyrWrapper = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
  .plyr--audio .plyr__controls {
    background: transparent;
    padding: 0px;
  }
`;
const CoverImage = styled.img`
  width: 120px;
  height: 120px;
`;
const Name = styled.span`
  color: #fff;
  font-family: Rubik;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 214.286% */
`;
const Author = styled.span`
  color: #fff;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */
`;
