import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { useMemo } from 'react';
import PostLike from 'src/components/social/PostLike';
import PostReply from 'src/components/social/PostReply';
import PostRepost from 'src/components/social/PostRepost';
import { defaultFormatFromNow } from '../../../../utils/shared/time';
import LinkBox from '../LinkBox';
import Badge from '../Badge';

export default function GridItem({
  data,
  clickAction,
}: {
  data: LinkListItem;
  clickAction?: () => void;
}) {
  const { tags, metadata, url, timestamp } = data;
  const platformLogo = useMemo(() => metadata?.icon || '', [metadata]);
  return (
    <Box
      onClick={() => {
        if (clickAction) clickAction();
      }}
    >
      <div className="content">
        <div className="link">
          <LinkBox text={url} logo={platformLogo} />
        </div>

        <h2>{metadata?.title}</h2>
        <div className="row">
          {tags?.length > 0 && <LinkBadge text={tags[0]} />}
          <div className="date">{defaultFormatFromNow(timestamp)}</div>
        </div>
        <LinkCardActionsWrapper>
          <PostLike
            disabled
            totalLikes={data?.total_like_num || 0}
            likeAvatars={[]}
          />
          <PostReply disabled totalReplies={data?.total_reply_num || 0} />
          <PostRepost disabled totalReposts={data?.total_repost_num || 0} />
        </LinkCardActionsWrapper>
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

const LinkBadge = styled(Badge)`
  max-width: 100%;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
`;
export const LinkCardActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -10px 0;
`;
