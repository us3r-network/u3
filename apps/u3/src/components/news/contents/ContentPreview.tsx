/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 16:07:10
 * @Description: file description
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useFullScreen from '../../../hooks/shared/useFullScreen';
import { ContentListItem } from '../../../services/news/types/contents';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';
import ContentShowerBox, {
  ContentShowerHandles,
  ContentShowerTabs,
  Tab,
} from './ContentShowerBox';
import { ContentItemActions } from './ListItem';
import { getContentShareUrl } from '../../../utils/shared/share';
import { SaveButton } from '@/components/shared/button/SaveButton';

export type ContentPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data?: ContentListItem;
  showAdminOps?: boolean;
  onAdminScore?: () => void;
  onAdminDelete?: () => void;
  onHidden?: () => void;
  onShare?: () => void;
};
export default function ContentPreview({
  data,
  showAdminOps = true,
  onAdminScore,
  onAdminDelete,
  onHidden,
  onShare,
  ...otherProps
}: ContentPreviewProps) {
  const navigate = useNavigate();
  const { ref, isFullscreen, onToggle } = useFullScreen();
  const [tab, setTab] = useState<Tab>('readerView');
  useEffect(() => {
    if (data?.supportReaderView) {
      setTab('readerView');
    } else {
      setTab('original');
    }
  }, [data]);
  const linkParam = useMemo(() => {
    return {
      url: data.link,
      type: 'content',
      title: data.title,
    };
  }, [data.link]);
  return (
    <ContentPreviewWrapper {...otherProps}>
      {data && (
        <>
          <Header>
            <ContentShowerTabs tab={tab} setTab={(t) => setTab(t)} />
            <HeaderRight>
              <SaveButton linkId="" link={linkParam} />
              <ContentItemActions
                id={data.id}
                editorScore={data.editorScore}
                hiddenAction={onHidden}
                shareLink={getContentShareUrl(data.id)}
                shareLinkEmbedTitle={
                  data?.title || data?.description || data?.value
                }
              />
              <ContentShowerHandles
                showAdminOps={showAdminOps}
                isForU={!!data?.isForU}
                editorScore={data?.editorScore || 0}
                deleteAction={onAdminDelete}
                thumbUpAction={onAdminScore}
                editAction={() => {
                  navigate(`/contents/create?id=${data.id}`);
                }}
                onFullscreenRequest={onToggle}
                onFullscreenExit={onToggle}
              />
            </HeaderRight>
          </Header>
          <ContentPreviewBox ref={ref}>
            <ContentShowerBox selectContent={data} tab={tab} />
            {isFullscreen && (
              <ContentPreviewFullscreen
                isFullscreen={isFullscreen}
                onClick={onToggle}
              />
            )}
          </ContentPreviewBox>
        </>
      )}
    </ContentPreviewWrapper>
  );
}
const ContentPreviewWrapper = styled.div`
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

const ContentPreviewBox = styled.div`
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
