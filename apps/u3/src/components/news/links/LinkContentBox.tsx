import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { contentParse } from 'src/services/news/api/contents';
import { Tweet } from 'react-tweet';
import { selectWebsite } from '../../../features/shared/websiteSlice';
import { useAppSelector } from '../../../store/hooks';
import ExtensionSupport from '../../layout/ExtensionSupport';
import Loading from '../../common/loading/Loading';
import LinkReaderView from './LinkReaderView';

export type Tab = 'original' | 'readerView';

export default function LinkContentBox({
  selectLink,
  tab,
}: {
  selectLink: LinkListItem | null;
  tab: Tab;
}) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [selectLink?.url]);

  useEffect(() => {
    if (!selectLink.readerView)
      contentParse(selectLink?.url).then((resp) => {
        // console.log(resp);
        selectLink.readerView = resp.data.data;
        selectLink.supportReaderView = true;
        return selectLink.readerView;
      });
  }, [selectLink]);

  return (
    <ContentBox>
      {(() => {
        if (!selectLink) return null;
        switch (tab) {
          case 'original':
            if (selectLink?.metadata?.twitter) {
              const tweetId = selectLink.url.split('/status/')[1];
              if (tweetId)
                return (
                  <div className="dark">
                    <Tweet id={tweetId} />
                  </div>
                );
            } else if (u3ExtensionInstalled || selectLink?.supportIframe) {
              return (
                <div className="iframe-container">
                  {!iframeLoaded && (
                    <LoadingBox>
                      <Loading />
                    </LoadingBox>
                  )}
                  <iframe
                    title={selectLink?.metadata?.title}
                    src={selectLink?.url}
                    style={{
                      opacity: iframeLoaded ? 1 : 0,
                    }}
                    onLoad={() => {
                      setIframeLoaded(true);
                    }}
                  />
                </div>
              );
            } else {
              return (
                <ExtensionSupport
                  btns
                  url={selectLink.url}
                  title={selectLink.metadata?.title}
                />
              );
            }
            break;
          case 'readerView':
            if (selectLink.readerView) {
              return <LinkReaderView data={selectLink} />;
            }
            break;
          default:
            return null;
        }
        return (
          <ExtensionSupport
            url={selectLink.url}
            title={selectLink.metadata?.title}
            msg="Reader view is not supported for this page! Please view it in the original tab."
          />
        );
      })()}
    </ContentBox>
  );
}

export const ContentBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  & img {
    max-width: 100%;
  }

  & pre {
    overflow: scroll;
  }

  & .iframe-container {
    width: 100%;
    height: 100%;

    & iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }

  & .dark {
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: scroll;
    /* & div {
      overflow: scroll;
    } */
  }
`;

export const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
`;
