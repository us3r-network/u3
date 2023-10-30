/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-20 14:20:49
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useFullScreen from '../../../hooks/shared/useFullScreen';
import { EventExploreListItemResponse } from '../../../services/news/types/event';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';
import EventLinkPreview, { EventPreviewHandles } from './EventLinkPreview';

export type EventPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data?: EventExploreListItemResponse;
  showAdminOps?: boolean;
};
export default function EventPreview({
  data,
  showAdminOps,
  ...otherProps
}: EventPreviewProps) {
  const { ref, isFullscreen, onToggle } = useFullScreen();
  return (
    <EventPreviewWrapper {...otherProps}>
      {data && (
        <>
          <Header>
            <EventPreviewHandles
              data={data}
              showAdminOps={showAdminOps}
              isFullscreen={isFullscreen}
              onFullscreenRequest={onToggle}
              onFullscreenExit={onToggle}
            />
          </Header>
          <EventLinkPreviewBox ref={ref}>
            <EventLinkPreview data={data} />
            {isFullscreen && (
              <EventLinkPreviewFullscreen
                isFullscreen={isFullscreen}
                onClick={onToggle}
              />
            )}
          </EventLinkPreviewBox>
        </>
      )}
    </EventPreviewWrapper>
  );
}
const EventPreviewWrapper = styled.div`
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
  justify-content: flex-end;
  align-items: center;
`;
const EventLinkPreviewBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  position: relative;
`;
const EventLinkPreviewFullscreen = styled(ButtonFullScreen)`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;
