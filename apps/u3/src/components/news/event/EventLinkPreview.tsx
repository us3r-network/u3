/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-20 14:05:29
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef, css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectWebsite } from '../../../features/shared/websiteSlice';
import { useAppSelector } from '../../../store/hooks';
import CannotOpenPlatFormLink from './CannotOpenPlatFormLink';
import { Edit3 } from '../../common/icons/edit';
import { ThumbUp } from '../../common/icons/thumbUp';
import { Trash } from '../../common/icons/trash';
import Loading from '../../common/loading/Loading';
import isUrl from '../../../utils/shared/isUrl';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';
import { EventExploreListItemResponse } from '../../../services/news/types/event';
import useAdminEventHandles from '../../../hooks/news/useAdminEventHandles';
import { Share } from '../../common/icons/share';
import useEventHandles from '../../../hooks/news/useEventHandles';
import { FavorButtonBase } from '../../shared/button/FavorButtonBase';

export type EventPreviewDataType = {
  name: string;
  platform?: {
    logo: string;
  };
  link: string;
  supportIframe: boolean;
  editorScore?: number;
};
export type EventLinkPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data: EventPreviewDataType;
};
export default React.forwardRef(function EventLinkPreview(
  { data, ...otherProps }: EventLinkPreviewProps,
  ref
) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const { platform, link, supportIframe, name } = data;
  const displayCannotOpen = !supportIframe && !u3ExtensionInstalled;
  const [iframeLoading, setIframeLoading] = useState(false);
  useEffect(() => {
    setIframeLoading(true);
  }, [data.link]);
  return (
    <EventPreviewWrapper ref={ref as React.Ref<HTMLDivElement>} {...otherProps}>
      {displayCannotOpen ? (
        <CannotOpenPlatFormLink
          iconUrl={platform?.logo || ''}
          linkUrl={link}
          title={name}
        />
      ) : (
        isUrl(link) && (
          <EventIframeBox>
            <EventIframe
              src={link}
              onLoad={() => {
                setIframeLoading(false);
              }}
            />
            {iframeLoading && (
              <EventIframeLoadingBox>
                <Loading />
              </EventIframeLoadingBox>
            )}
          </EventIframeBox>
        )
      )}
    </EventPreviewWrapper>
  );
});
const EventPreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const EventIframeBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const EventIframeLoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1b1e23;
`;
const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export type EventPreviewHandlesType = {
  data?: EventExploreListItemResponse;
  showAdminOps?: boolean;
  isFullscreen?: boolean;
  onFullscreenRequest?: () => void;
  onFullscreenExit?: () => void;
};
export type EventPreviewHandlesProps = StyledComponentPropsWithRef<'div'> &
  EventPreviewHandlesType;
export function EventPreviewHandles({
  data,
  showAdminOps,
  isFullscreen,
  onFullscreenRequest,
  onFullscreenExit,
  ...props
}: EventPreviewHandlesProps) {
  const navigate = useNavigate();
  const { onAdminThumbUp, onAdminDelete } = useAdminEventHandles();
  const { onShare } = useEventHandles();
  return (
    <EventPreviewHandlesWrapper {...props}>
      {!!data?.linkStreamId && <FavorBtn linkId={data.linkStreamId} />}

      <EventHandleButton
        onClick={() => {
          onShare(data);
        }}
      >
        <Share />
      </EventHandleButton>
      {showAdminOps && (
        <>
          <EventHandleButton
            onClick={() => {
              if (onAdminThumbUp) onAdminThumbUp(data);
            }}
          >
            <ThumbUp />
            &nbsp; {data?.editorScore || 0}
          </EventHandleButton>
          <EventHandleButton
            onClick={() => {
              navigate(`/events/${data?.id}/edit`);
            }}
          >
            <Edit3 />
          </EventHandleButton>
          <EventHandleButton
            onClick={() => {
              if (onAdminDelete) onAdminDelete(data);
            }}
          >
            <Trash />
          </EventHandleButton>
          <EventButtonLine />
        </>
      )}

      <ButtonFullScreen
        isFullscreen={isFullscreen}
        onClick={isFullscreen ? onFullscreenExit : onFullscreenRequest}
      />
    </EventPreviewHandlesWrapper>
  );
}
const EventPreviewHandlesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const EventButtonLine = styled.span`
  display: inline-block;
  width: 1px;
  height: 10px;
  background: #718096;
`;
const EventButtonBaseCss = css`
  padding: 6px;
  height: 32px;
  background-color: #1b1e23;
`;
const EventHandleButton = styled(ButtonPrimaryLine)`
  ${EventButtonBaseCss}
`;
const FavorBtn = styled(FavorButtonBase)`
  padding: 6px;
  height: 32px;
  background-color: #1b1e23;
  svg {
    fill: #718096;
  }
  span {
    color: #718096;
  }
`;
