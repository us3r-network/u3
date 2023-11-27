import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LinkListItem } from 'src/services/news/types/links';
import PostLike from 'src/components/social/PostLike';
import PostReply from 'src/components/social/PostReply';
import PostReport from 'src/components/social/PostRepost';
import { defaultFormatFromNow } from '../../../../utils/shared/time';
import LinkBox from '../LinkBox';

export default function ListItem({
  data,
  isActive,
  clickAction,
}: {
  data: LinkListItem;
  isActive: boolean;
  clickAction: () => void;
}) {
  const { metadata, url, timestamp } = data;
  const itemRef = useRef<HTMLDivElement & { isActive: boolean }>();
  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (isActive) {
      setClassNames('active');
    } else {
      setClassNames('');
    }
  }, [isActive]);
  const platformLogo = useMemo(() => metadata?.icon || '', [metadata]);

  return (
    <Item
      ref={itemRef}
      className={classNames}
      onClick={clickAction}
      isActive={isActive}
    >
      <ItemInner isActive={isActive}>
        <div className={isActive ? 'right active' : 'right'}>
          <p>{metadata?.title}</p>
          <ItemTitle>
            <div>
              <LinkBox text={url} logo={platformLogo} />
            </div>
            <span>{defaultFormatFromNow(timestamp)}</span>
          </ItemTitle>
          {isActive && (
            <LinkCardActionsWrapper>
              <PostLike
                disabled
                totalLikes={data?.total_like_num || 0}
                likeAvatars={[]}
                // liking={liking}
                // liked={liked}
                // likeAction={likeAction}
              />
              <PostReply
                disabled
                totalReplies={data?.total_reply_num || 0}
                // replying={replying}
                // replied={replied}
                // replyAction={replyAction}
              />
              <PostReport
                disabled
                totalReposts={data?.total_repost_num || 0}
                // reposting={reposting}
                // reposted={reposted}
                // repostAction={repostAction}
              />
            </LinkCardActionsWrapper>
          )}
        </div>
      </ItemInner>
    </Item>
  );
}

const Item = styled.div<{ isActive: boolean }>`
  box-sizing: border-box;
  padding: 20px;
  gap: 10px;
  border-bottom: 1px solid #39424c;
  cursor: ${(props) => (props.isActive ? '' : 'pointer')};
  background: inherit;
  position: relative;
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
const ItemInner = styled.div<{ isActive: boolean }>`
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
    height: fit-content;
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
      /* background-color: #ffffff; */
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
    gap: 16px;
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
      -webkit-line-clamp: 2;
    }
    &.active {
      > p {
        -webkit-line-clamp: 4;
      }
    }
  }
`;
const ItemTitle = styled.div`
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
    max-width: 200px;
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
export const LinkCardActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -10px 0;
`;
