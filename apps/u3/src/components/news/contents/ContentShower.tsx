import { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { ContentListItem } from '../../../services/news/types/contents';
import { getContentPlatformLogoWithJsonValue } from '../../../utils/news/content';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import Badge from './Badge';
import LinkBox from './LinkBox';
import ContentCommentLayout from './comment/ContentCommentLayout';
import ContentActions from './action/ContentActions';

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
  const [linkParam, setLinkParam] = useState(null);
  useEffect(() => {
    setLinkParam({
      url: link,
      type: 'content',
      title,
    });
  }, [link, title]);
  return (
    <Shower>
      <ContentWrapper>
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
        {!isMobile && (
          <ContentActionsStyled linkId={data.linkStreamId} link={linkParam} />
        )}
      </ContentWrapper>
      {!isMobile && (
        <ContentCommentLayoutStyled
          linkId={data.linkStreamId}
          link={linkParam}
        />
      )}
    </Shower>
  );
}

const Shower = styled.div`
  height: 100%;
  display: flex;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  position: relative;
`;

const ContentActionsStyled = styled(ContentActions)`
  position: sticky;
  bottom: 0px;
  left: 50%;
`;
const ContentCommentLayoutStyled = styled(ContentCommentLayout)`
  width: 340px;
  border-left: 1px solid #39424c;
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
