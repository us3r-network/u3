import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { selectWebsite } from '../../features/website/websiteSlice';
import useLogin from '../../hooks/useLogin';
import { contentParse } from '../../services/api/contents';
import { ContentListItem } from '../../services/types/contents';
import { useAppSelector } from '../../store/hooks';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import ButtonFullScreen from '../common/button/ButtonFullScreen';
import ExtensionSupport from '../common/ExtensionSupport';
import Loading from '../common/loading/Loading';
import { Edit3 } from '../icons/edit';
import { ThumbUp } from '../icons/thumbUp';
import { Trash } from '../icons/trash';
import ContentShower from './ContentShower';

const urlCache: { [key: string]: string } = {};
export type Tab = 'original' | 'readerView';

export default function ContentShowerBox({
  selectContent,
  tab,
}: {
  selectContent: ContentListItem | undefined;
  tab: Tab;
}) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const [daylightContentLoading, setDaylightContentLoading] = useState(false);
  const [daylightContent, setDaylightContent] = useState('');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const loadDaylightContent = useCallback(async (url: string) => {
    if (urlCache[url]) {
      setDaylightContent(urlCache[url]);
      return;
    }
    setDaylightContent('');
    try {
      setDaylightContentLoading(true);
      const { data } = await contentParse(url);
      urlCache[url] = data.data.content;
      setDaylightContent(data.data.content);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDaylightContentLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      tab === 'readerView' &&
      selectContent?.supportReaderView &&
      !selectContent.value
    ) {
      loadDaylightContent(selectContent.link);
    }
  }, [tab]);

  useEffect(() => {
    setIframeLoaded(false);
    setDaylightContent('');
  }, [selectContent?.link]);

  const contentValue = useMemo(() => {
    if (!selectContent?.value) return '';
    try {
      const content = JSON.parse(selectContent?.value);
      return content.content;
    } catch (error) {
      return selectContent?.value;
    }
  }, [selectContent]);

  return (
    <ContentBox>
      {(() => {
        if (!selectContent) return null;
        if (tab === 'original') {
          if (u3ExtensionInstalled || selectContent?.supportIframe) {
            return (
              <div className="iframe-container">
                {!iframeLoaded && (
                  <LoadingBox>
                    <Loading />
                  </LoadingBox>
                )}
                <iframe
                  title="daylight"
                  src={selectContent?.link}
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
              url={selectContent.link}
              title={selectContent.title}
              img={
                selectContent.imageUrl ||
                (selectContent.uniProjects &&
                  selectContent.uniProjects[0]?.image)
              }
            />
          );
        }
        if (tab === 'readerView') {
          if (daylightContentLoading) {
            return (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            );
          }
          if (contentValue || daylightContent) {
            return (
              <ContentShower
                data={selectContent}
                content={daylightContent || contentValue}
              />
            );
          }
        }
        return (
          <ExtensionSupport
            url={selectContent.link}
            title={selectContent.title}
            msg="Reader view is not supported for this page! Please view it in the original tab."
            img={
              selectContent.imageUrl ||
              (selectContent.uniProjects && selectContent.uniProjects[0]?.image)
            }
          />
        );
      })()}
    </ContentBox>
  );
}
export function ContentShowerTabs({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  return (
    <ContentShowerTabsWrapper className="content-shower-tabs">
      <button
        type="button"
        className={tab === 'original' ? 'tab-item active' : 'tab-item'}
        onClick={() => {
          setTab('original');
        }}
      >
        Original
      </button>
      <button
        className={tab === 'readerView' ? 'tab-item active' : 'tab-item'}
        type="button"
        onClick={() => {
          setTab('readerView');
        }}
      >
        ReaderView
      </button>
    </ContentShowerTabsWrapper>
  );
}

export function ContentShowerHandles({
  showAdminOps = true,
  isForU,
  thumbUpAction,
  deleteAction,
  editAction,
  editorScore,
  isFullscreen,
  onFullscreenRequest,
  onFullscreenExit,
}: {
  showAdminOps?: boolean;
  thumbUpAction?: () => void;
  deleteAction?: () => void;
  editAction?: () => void;
  isForU?: boolean;
  editorScore?: number;
  isFullscreen?: boolean;
  onFullscreenRequest?: () => void;
  onFullscreenExit?: () => void;
}) {
  const { isAdmin } = useLogin();
  return (
    <ContentShowerHandlesWrapper className="content-shower-handles">
      {showAdminOps && !isForU && isAdmin && (
        <>
          <ContentHandleButton
            onClick={() => {
              if (thumbUpAction) thumbUpAction();
            }}
          >
            <ThumbUp />
            &nbsp; {editorScore || 0}
          </ContentHandleButton>
          <ContentHandleButton
            onClick={() => {
              if (editAction) editAction();
            }}
          >
            <Edit3 />
          </ContentHandleButton>
          <ContentHandleButton
            onClick={() => {
              if (deleteAction) deleteAction();
            }}
          >
            <Trash />
          </ContentHandleButton>
          <VerticalDividingLine />
        </>
      )}
      <ButtonFullScreen
        className="content-fullscreen-button"
        isFullscreen={isFullscreen}
        onClick={isFullscreen ? onFullscreenExit : onFullscreenRequest}
      />
    </ContentShowerHandlesWrapper>
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
const ContentShowerTabsWrapper = styled.div`
  width: 260px;
  height: 40px;
  background: #14171a;
  border-radius: 100px;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tab-item {
    cursor: pointer;
    width: 122px;
    height: 32px;
    border: none;

    box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
      0px 0px 4px rgba(20, 23, 26, 0.04);
    border-radius: 100px;
    outline: none;
    background: inherit;
    color: #a0aec0;

    &.active {
      color: #ffffff;
      background: #21262c;
    }
  }
`;
const ContentShowerHandlesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  .content-fullscreen-button {
    margin-left: auto;
  }
`;

export const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
`;
const ContentHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const VerticalDividingLine = styled.span`
  display: inline-block;
  width: 1px;
  height: 10px;
  background: #718096;
`;
