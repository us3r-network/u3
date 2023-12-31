import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import Badge from './Badge';
import LinkBox from './LinkBox';
// import ContentCommentLayout from './comment/ContentCommentLayout';
// import ContentActions from './action/ContentActions';

export default function LinkReaderView({ data }: { data: LinkListItem }) {
  const contentFix = useMemo(() => {
    if (!data.url || !data.readerView) return null;
    const placeholder = document.createElement('div');
    placeholder.innerHTML = data.readerView.content;
    const imgs = placeholder.getElementsByTagName('img');
    const linkUrl = new URL(data.url);
    for (let i = 0; i < imgs.length; i++) {
      const imgItem = imgs[i];
      const srcAttr = imgItem.getAttribute('src');
      if (srcAttr && srcAttr.startsWith('/')) {
        imgItem.setAttribute('src', linkUrl.origin + srcAttr);
      }
    }
    return placeholder.innerHTML;
  }, [data.url, data.readerView]);

  const platformLogo = useMemo(() => data.metadata.icon || '', [data.metadata]);

  return (
    <Shower>
      <ContentWrapper>
        <ContentTitle>
          <div className="title">{data.readerView?.title}</div>
          {data.tags?.length > 0 && (
            <div className="tags">
              {data.tags.map((tag) => (
                <Badge text={tag} key={tag} className="tag" />
              ))}
            </div>
          )}

          <div className="info">
            <LinkBox text={data.url} logo={platformLogo} />
            <span>{defaultFormatFromNow(data.timestamp)}</span>
          </div>
        </ContentTitle>
        <ContentBody dangerouslySetInnerHTML={{ __html: contentFix }} />
        {/* {!isMobile && data.url && <ContentActionsStyled linkId={data.url} />} */}
      </ContentWrapper>
      {/* {!isMobile && data.url && (
        <ContentCommentLayoutStyled linkId={data.url} />
      )} */}
    </Shower>
  );
}

const Shower = styled.div`
  width: 100%;
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

// const ContentActionsStyled = styled(ContentActions)`
//   position: sticky;
//   bottom: 0px;
//   left: 50%;
// `;
// const ContentCommentLayoutStyled = styled(ContentCommentLayout)`
//   width: 340px;
//   border-left: 1px solid #39424c;
// `;

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
  width: 100%;
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
