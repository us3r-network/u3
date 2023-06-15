import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../constants';
import { defaultFormatFromNow } from '../../utils/time';
import LinkBox from './LinkBox';
import Badge from './Badge';
import { getContentPlatformLogoWithJsonValue } from '../../utils/content';
import { ContentListItem } from '../../services/types/contents';

import './griditem.css';
import { VoteTextButtonStyled } from '../common/VoteButtonStyled';

export function GridItemHidden({
  undoAction,
  isActive,
  hidden,
}: {
  undoAction: () => void;
  isActive: boolean;
  hidden?: boolean;
}) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [width, setWidth] = useState('fit-content');
  const itemRef = useRef<HTMLDivElement>();

  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (hidden) {
      const { clientWidth } = itemRef.current;
      setWidth(`${clientWidth}px`);

      timerRef.current = setTimeout(() => {
        setClassNames('active hidden');
      }, 3050);
    }
    if (isActive) {
      setClassNames('active');
    } else {
      setClassNames('');
    }
  }, [hidden, isActive]);
  return (
    <Box ref={itemRef} isActive width={width} className={classNames}>
      <div className="tint">
        <div> 😊 Thanks, We will use this to make your list better. </div>
        <br />
        <span
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            undoAction();
          }}
        >
          Undo
        </span>
      </div>
    </Box>
  );
}

export default function GridItem({
  data,
  clickAction,
}: {
  data: ContentListItem;
  clickAction?: () => void;
}) {
  const { tags, link, createdAt, title, upVoteNum, editorScore, value } = data;
  const platformLogo = getContentPlatformLogoWithJsonValue(value);
  return (
    <Box
      onClick={() => {
        if (clickAction) clickAction();
      }}
    >
      <div className="content">
        <div className="link">
          <LinkBox text={link} logo={platformLogo} />
        </div>

        <h2>{title}</h2>
        <div className="row">
          {tags?.length > 0 && <ContentBadge text={tags[0]} />}
          <div className="date">{defaultFormatFromNow(createdAt)}</div>
        </div>
        <div className="authkit-grid">
          {data.linkStreamId && (
            <VoteTextButtonStyled linkId={data.linkStreamId} isDisabled />
          )}
        </div>
      </div>
    </Box>
  );
}
const Box = styled.div<{ isActive?: boolean; width?: string }>`
  .tint {
    padding: 20px;
  }

  .content {
    padding: 20px;
    min-height: 176px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
    transition: all 0.3s;
    .link {
      margin-bottom: -8px;
    }
  }

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  color: #ffffff;

  &.active {
    background: #14171a;
    transition: all 0.8s ease-out;
    width: ${(props) => props.width};
    > p {
      opacity: 1;
    }
    &.hidden {
      font-size: 0;
      margin-left: 0;
      margin-right: 0;
      opacity: 0;
      padding-left: 0;
      padding-right: 0;
      width: 0;
    }
  }

  & h2 {
    margin: 0;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    transition: all 0.3s;
  }

  &:hover {
    & > .content {
      transform: scale(1.05);
    }
  }

  & div.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  & div.date {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #718096;
  }
`;

const ContentBadge = styled(Badge)`
  max-width: 100%;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
`;
