/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 18:48:42
 * @Description: file description
 */
import { useEffect, useState } from 'react';
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
import { cn } from '@/lib/utils';

export type LinkPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data?: LinkListItem;
  isV2Layout?: boolean;
  castClickAction?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    castHex: string
  ) => void;
};
export default function LinkPreview({
  data,
  isV2Layout,
  castClickAction,
  ...otherProps
}: LinkPreviewProps) {
  // const navigate = useNavigate();
  const { ref, isFullscreen, onToggle } = useFullScreen();
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
        <div
          className={cn(
            'w-full h-[60px] box-border bg-[#1b1e23] justify-between items-center relative',
            'max-sm:hidden'
          )}
        >
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
        </div>
        <div className="w-full h-[0] flex flex-row gap-[12px] flex-shrink flex-grow">
          <LinkContentBox selectLink={data} />
          <div
            className={cn(
              'w-[360px] h-full flex-shrink-0 flex-grow-0',
              'max-sm:hidden'
            )}
          >
            <LinkPost
              url={data.url}
              isV2Layout={isV2Layout}
              castClickAction={castClickAction}
            />
          </div>
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
