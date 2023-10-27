/* eslint-disable react/no-unescaped-entities */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 16:48:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 11:57:46
 * @Description: file description
 */
import styled from 'styled-components';
import ModalBase, { ModalBaseBody } from '../../common/modal/ModalBase';
import EventLinkPreview, { EventPreviewHandles } from './EventLinkPreview';
import { Close } from '../../common/icons/close';
import useFullScreen from '../../../hooks/shared/useFullScreen';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';
import { EventExploreListItemResponse } from '../../../services/news/types/event';

export type EventPreviewModalProps = {
  isOpen: boolean;
  data?: EventExploreListItemResponse;
  onClose?: () => void;
  showAdminOps?: boolean;
};

export default function EventPreviewModal({
  isOpen,
  data,
  onClose,
  showAdminOps,
}: EventPreviewModalProps) {
  const { ref, isFullscreen, onToggle } = useFullScreen();
  return (
    <ModalBase isOpen={isOpen}>
      <ModalBody>
        {data && (
          <>
            <Header>
              <EventPreviewHandles
                className="event-preview-handles"
                data={data}
                showAdminOps={showAdminOps}
                isFullscreen={isFullscreen}
                onFullscreenRequest={onToggle}
                onFullscreenExit={onToggle}
              />
              <CloseBox onClick={onClose}>
                <Close />
              </CloseBox>
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
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled(ModalBaseBody)`
  margin-top: 40px;
  width: 976px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  .event-preview-handles {
    margin-left: auto;
  }
`;
const CloseBox = styled.div`
  cursor: pointer;
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
