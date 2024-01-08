/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 18:48:42
 * @Description: file description
 */
import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { MultiPlatformShareMenuBtn } from 'src/components/shared/share/MultiPlatformShareMenuBtn';
import { LINK_SHARE_TITLE } from 'src/constants';
import { getLinkShareUrl } from 'src/utils/shared/share';
import useFullScreen from '../../../hooks/shared/useFullScreen';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';
import LinkContentBox, { Tab } from './LinkContentBox';
import LinkPost from './LinkPost';
import { SaveButton } from '@/components/shared/button/SaveButton';

export type LinkPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data?: LinkListItem;
};
export default function LinkPreview({ data, ...otherProps }: LinkPreviewProps) {
  // const navigate = useNavigate();
  const { ref, isFullscreen, onToggle } = useFullScreen();
  const [tab, setTab] = useState<Tab>('original');
  // useEffect(() => {
  //   if (data?.supportIframe) {
  //     setTab('original');
  //   } else {
  //     setTab('readerView');
  //   }
  // }, [data]);
  const [linkParam, setLinkParam] = useState(null);
  useEffect(() => {
    setLinkParam({
      url: data.url.slice(0, 100), // todo: expand this limit at model
      type: 'link',
      title: data.metadata.title.slice(0, 200),
    });
  }, [data.url]);
  return (
    data && (
      <PreviewBox ref={ref} {...otherProps}>
        <Header>
          <LinkRenderSwitchTabs tab={tab} setTab={(t) => setTab(t)} />
          <HeaderRight>
            <SaveButton linkId={null} link={linkParam} />
            <LinkShareMenuBtn
              shareLink={getLinkShareUrl(data.url)}
              shareLinkDefaultText={LINK_SHARE_TITLE}
              shareLinkEmbedTitle={data?.metadata?.title}
              popoverConfig={{ placement: 'top end', offset: 0 }}
            />
            <ButtonFullScreen
              className="content-fullscreen-button"
              isFullscreen={isFullscreen}
              onClick={onToggle}
            />
          </HeaderRight>
          {isFullscreen && (
            <ContentPreviewFullscreen
              isFullscreen={isFullscreen}
              onClick={onToggle}
            />
          )}
        </Header>
        <div className="w-full flex gap-2">
          <LinkContentBox selectLink={data} tab={tab} />
          <LinkPostWrapper>
            <LinkPost url={data.url} />
          </LinkPostWrapper>
        </div>
      </PreviewBox>
    )
  );
}

const PreviewBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
`;
const LinkPostWrapper = styled.div`
  width: 360px;
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
`;
const Header = styled.div`
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  background: #1b1e23;
  /* border-bottom: 1px solid #39424c; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;
const ContentPreviewFullscreen = styled(ButtonFullScreen)`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;

function LinkRenderSwitchTabs({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  return (
    <LinkRenderSwitchTabsWrapper className="content-shower-tabs">
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
    </LinkRenderSwitchTabsWrapper>
  );
}

const LinkRenderSwitchTabsWrapper = styled.div`
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
export const LinkShareMenuBtn = styled(MultiPlatformShareMenuBtn)`
  border: none;
  padding: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: none;
  &:not(:disabled):hover {
    border: none;
    background-color: #14171a;
  }
  & > svg {
    width: 16px;
    height: 16px;
    cursor: pointer;
    path {
      stroke: #ffffff;
    }
  }
`;
