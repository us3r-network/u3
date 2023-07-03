import { useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { Comments } from '@us3r-network/link';
import { ContentListItem } from '../../services/types/contents';
import { getContentPlatformLogoWithJsonValue } from '../../utils/content';
import { defaultFormatFromNow } from '../../utils/time';
import Badge from './Badge';
import LinkBox from './LinkBox';

export default function ContentShower({
  data,
  content,
}: {
  data: ContentListItem;
  content: string;
}) {
  const { title, tags, createdAt, link, value } = data;
  const contentFix = useMemo(() => {
    if (!link) return content;
    const placeholder = document.createElement('div');
    placeholder.innerHTML = content;
    const imgs = placeholder.getElementsByTagName('img');
    const linkUrl = new URL(link);
    for (let i = 0; i < imgs.length; i++) {
      const imgItem = imgs[i];
      const srcAttr = imgItem.getAttribute('src');
      if (srcAttr && srcAttr.startsWith('/')) {
        imgItem.setAttribute('src', linkUrl.origin + srcAttr);
      }
    }
    return placeholder.innerHTML;
  }, [content, link]);
  const platformLogo = useMemo(
    () => getContentPlatformLogoWithJsonValue(value),
    [value]
  );
  return (
    <Shower>
      <div className="content-container">
        <ContentTitle>
          <div className="title">{title}</div>
          {tags?.length > 0 && (
            <div className="tags">
              {tags.map((tag) => (
                <Badge text={tag} key={tag} className="tag" />
              ))}
            </div>
          )}

          <div className="info">
            <LinkBox text={link} logo={platformLogo} />
            <span>{defaultFormatFromNow(createdAt)}</span>
          </div>
        </ContentTitle>
        <ContentBody dangerouslySetInnerHTML={{ __html: contentFix }} />
        <br />
        {!isMobile && data.linkStreamId && (
          <Comments linkId={data.linkStreamId} className="comments" />
        )}
      </div>
    </Shower>
  );
}

const Shower = styled.div`
  height: calc(100% - 20px);
  overflow: scroll;

  .content-container {
    padding: 20px;
    .comments {
      margin-top: 20px;
    }
  }
`;

const ContentTitle = styled.div`
  border-bottom: 1px dotted #39424c;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;
  > .title {
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #ffffff;
    ${isMobile &&
    `
        font-size: 20px;
        line-height: 24px;
      `}
  }
  > .tags {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
    .tag {
      flex-shrink: 0;
    }
  }
  > .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > span {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #718096;
      flex-shrink: 0;
      margin-left: 20px;
    }
  }
`;
const ContentBody = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;

  color: #718096;
  padding-top: 20px;

  & h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    color: #ffffff;
  }

  & a {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #a57dff;
  }
`;
