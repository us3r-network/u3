/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 16:57:16
 * @Description: file description
 */
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import useFullScreen from '../../../hooks/shared/useFullScreen';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';
import LinkShowerBox, { Tab } from './LinkShowerBox';

export type LinkPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data?: LinkListItem;
};
export default function LinkPreview({ data, ...otherProps }: LinkPreviewProps) {
  // const navigate = useNavigate();
  const { ref, isFullscreen, onToggle } = useFullScreen();
  const [tab, setTab] = useState<Tab>('readerView');
  useEffect(() => {
    if (data?.supportReaderView) {
      setTab('readerView');
    } else {
      setTab('original');
    }
  }, [data]);

  return (
    <PreviewWrapper {...otherProps}>
      {data && (
        <>
          <Header>
            <LinkRenderSwitchTabs tab={tab} setTab={(t) => setTab(t)} />
            <HeaderRight>
              <ButtonFullScreen
                className="content-fullscreen-button"
                isFullscreen={isFullscreen}
                onClick={onToggle}
              />
            </HeaderRight>
          </Header>
          <PreviewBox ref={ref}>
            <LinkShowerBox selectLink={data} tab={tab} />
            {isFullscreen && (
              <ContentPreviewFullscreen
                isFullscreen={isFullscreen}
                onClick={onToggle}
              />
            )}
          </PreviewBox>
        </>
      )}
    </PreviewWrapper>
  );
}

const PreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  width: 100%;
  height: 60px;
  padding: 14px;
  box-sizing: border-box;
  background: #1b1e23;
  border-bottom: 1px solid #39424c;
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

const PreviewBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  position: relative;
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
