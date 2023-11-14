import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { selectWebsite } from '../../../features/shared/websiteSlice';
import { useAppSelector } from '../../../store/hooks';
import ExtensionSupport from '../../layout/ExtensionSupport';
import Loading from '../../common/loading/Loading';
import ContentShower from './LinkShower';

export type Tab = 'original' | 'readerView';

export default function LinkShowerBox({
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

  const contentValue = useMemo(() => {
    if (!selectLink?.value) return '';
    try {
      const content = JSON.parse(selectLink?.value);
      return content.content as string;
    } catch (error) {
      return selectLink?.value;
    }
  }, [selectLink]);

  return (
    <ContentBox>
      {(() => {
        if (!selectLink) return null;
        if (tab === 'original') {
          if (u3ExtensionInstalled || selectLink?.supportIframe) {
            return (
              <div className="iframe-container">
                {!iframeLoaded && (
                  <LoadingBox>
                    <Loading />
                  </LoadingBox>
                )}
                <iframe
                  title={selectLink?.title}
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
          }
          return (
            <ExtensionSupport
              btns
              url={selectLink.url}
              title={selectLink.title}
            />
          );
        }
        if (tab === 'readerView') {
          if (contentValue) {
            return <ContentShower data={selectLink} />;
          }
        }
        return (
          <ExtensionSupport
            url={selectLink.url}
            title={selectLink.title}
            msg="Reader view is not supported for this page! Please view it in the original tab."
          />
        );
      })()}
    </ContentBox>
  );
}

export const ContentBoxContainer = styled.div`
  height: 100%;
  width: calc(100% - 360px);
`;

export const ContentBox = styled.div`
  height: calc(100%);
  width: 100%;

  overflow-x: hidden;
  overflow: hidden;

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
`;

export const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
`;
