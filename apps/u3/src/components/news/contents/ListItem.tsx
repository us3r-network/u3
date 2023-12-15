import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
// import { Share } from '../../common/icons/share';
// import { EyeClose } from '../icons/eyeClose';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import LinkBox from './LinkBox';
import { getContentPlatformLogoWithJsonValue } from '../../../utils/news/content';
import type { ContentExploreListItemData } from './ContentList';
// import { VoteButtonBase } from '../../shared/button/VoteButtonBase';
import { MultiPlatformShareMenuBtn } from '../../shared/share/MultiPlatformShareMenuBtn';
import { CONTENT_SHARE_TITLE } from '../../../constants';

export default function ListItem({
  data,
  isActive,
  clickAction,
}: {
  data: ContentExploreListItemData;
  isActive: boolean;
  clickAction: () => void;
}) {
  const { value, link, createdAt, title, hidden } = data;
  // const currentLink = {
  //   url: link,
  //   title,
  //   type: 'content',
  // };
  const itemRef = useRef<HTMLDivElement & { isActive: boolean }>();
  const [height, setHeight] = useState('fit-content');
  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (hidden) {
      const { clientHeight } = itemRef.current;
      setHeight(`${clientHeight}px`);
      setTimeout(() => {
        setClassNames('active hidden');
      }, 50);
    }
    if (isActive) {
      setClassNames('active');
    } else {
      setClassNames('');
    }
  }, [hidden, isActive]);
  const platformLogo = useMemo(
    () => getContentPlatformLogoWithJsonValue(value),
    [value]
  );

  return (
    <ContentItem
      ref={itemRef}
      className={classNames}
      onClick={clickAction}
      isActive={isActive}
    >
      <ItemInner isActive={isActive} height={height}>
        {/* <div className="left">
          <VoteButtonStyled linkId={linkStreamId} link={currentLink} />
        </div> */}

        <div className={isActive ? 'right active' : 'right'}>
          <p>{title}</p>
          <ContentItemTitle>
            <div>
              <LinkBox text={link} logo={platformLogo} />
            </div>
            <span>{defaultFormatFromNow(createdAt)}</span>
          </ContentItemTitle>
        </div>
      </ItemInner>
    </ContentItem>
  );
}
// const VoteButtonStyled = styled(VoteButtonBase)`
//   width: 60px;
//   height: 60px;
//   padding: 0;
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
//   svg {
//     width: 18px;
//     height: 18px;
//   }
// `;

export function ContentItemActions({
  id,
  isActive,
  editorScore,
  hiddenAction,
  shareLink,
  shareLinkEmbedTitle,
}: // withVote,
{
  id: number;
  isActive?: boolean;
  editorScore: number;
  hiddenAction?: () => void;
  // withVote?: boolean;
  shareLink: string;
  shareLinkEmbedTitle: string;
}) {
  return (
    <ContentItemActionsWrapper>
      {/* <ContentHandleButton
        onClick={(e) => {
          e.stopPropagation();
          if (hiddenAction) {
            hiddenAction();
          }
        }}
      >
        <EyeClose />
      </ContentHandleButton> */}

      <ContentShareMenuBtn
        shareLink={shareLink}
        shareLinkDefaultText={CONTENT_SHARE_TITLE}
        shareLinkEmbedTitle={shareLinkEmbedTitle}
        popoverConfig={{ placement: 'bottom end', offset: 0 }}
      />
    </ContentItemActionsWrapper>
  );
}
export const ContentShareMenuBtn = styled(MultiPlatformShareMenuBtn)``;

export function ListItemHidden({
  undoAction,
  isActive,
  hidden,
}: {
  undoAction: () => void;
  isActive: boolean;
  hidden?: boolean;
}) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [height, setHeight] = useState('fit-content');
  const itemRef = useRef<HTMLDivElement>();

  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (hidden) {
      const { clientHeight } = itemRef.current;
      setHeight(`${clientHeight}px`);

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
    <ContentItem isActive={isActive} className={classNames} ref={itemRef}>
      <ItemInner isActive={isActive} height={height}>
        <div className="tint">
          😊 Thanks, We will use this to make your list better.{' '}
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
      </ItemInner>
    </ContentItem>
  );
}

const ContentItem = styled.div<{ isActive: boolean }>`
  box-sizing: border-box;
  padding: 20px;
  gap: 10px;
  border-bottom: 1px solid #39424c;
  cursor: pointer;
  border-bottom: 1px do lightgray;
  background: inherit;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }

  ${({ isActive }) =>
    isActive &&
    `
      background: #14171a;
      transition: all 0.5s ease-out;
      &::after {
        content: ' ';
        top: 0;
        right: 0;
        height: 100%;
        position: absolute;
        width: 2px;
        background-color: #ffffff;
      }
      &.hidden {
        font-size: 0;
        margin-top: 0;
        margin-bottom: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
        height: 0;
      }
  `}
`;
const ItemInner = styled.div<{ isActive: boolean; height: string }>`
  line-height: 27px;
  gap: 10px;
  position: relative;
  display: flex;
  transition: all 0.3s;
  color: '#fff';
  &:hover {
    /* background: #999; */
  }

  &.active {
    background: #14171a;
    transition: all 0.5s ease-out;
    height: ${(props) => props.height};
    > p {
      opacity: 1;
    }
    &::after {
      content: ' ';
      top: 0;
      right: 0;
      height: 100%;
      position: absolute;
      width: 2px;
      background-color: #ffffff;
    }
    &.hidden {
      font-size: 0;
      margin-top: 0;
      margin-bottom: 0;
      opacity: 0;
      padding-top: 0;
      padding-bottom: 0;
      height: 0;
    }
  }

  & .tint {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #718096;
    & span {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;

      color: #ffffff;
    }
  }

  & div.right {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > p {
      margin: 0%;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
      opacity: 0.8;

      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    &.active {
      > p {
        display: block;
      }
    }
  }
`;
// const ContentItemLeftVoteButton = styled(ButtonPrimaryLine)`
//   width: 50px;
//   height: 50px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 0;
//   > span {
//     color: #ffffff;
//     font-size: 12px;
//     line-height: 14px;
//   }
// `;
const ContentItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;

  > div {
    display: flex;
    gap: 10px;
    align-items: center;
    max-width: 160px;
  }

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #39424c; */
    border-radius: 12px;
    /* padding: 0 18px; */
    /* height: 32px; */
    /* box-sizing: border-box; */
    flex-shrink: 0;
  }

  & .author {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ContentItemActionsWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: end;
  align-items: center;
`;
