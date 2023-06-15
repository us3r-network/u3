import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useFullScreen from '../../hooks/useFullScreen';
import { ContentListItem } from '../../services/types/contents';
import ButtonFullScreen from '../common/button/ButtonFullScreen';
import { Close } from '../icons/close';
import ContentShowerBox, {
  ContentShowerHandles,
  ContentShowerTabs,
  Tab,
} from './ContentShowerBox';
import { ContentItemActions } from './ListItem';

export default function GridModal({
  show,
  closeModal,
  selectContent,
  hiddenAction,
  shareAction,
  onAdminScore,
  onAdminDelete,
}: {
  show: boolean;
  closeModal: () => void;
  selectContent: ContentListItem | undefined;
  hiddenAction?: () => void;
  shareAction?: () => void;
  onAdminScore?: () => void;
  onAdminDelete?: () => void;
}) {
  const navigate = useNavigate();
  const { ref, isFullscreen, onToggle } = useFullScreen();
  const [tab, setTab] = useState<Tab>('readerView');
  useEffect(() => {
    if (selectContent?.supportReaderView) {
      setTab('readerView');
    } else {
      setTab('original');
    }
  }, [selectContent]);
  return (
    <Modal
      isOpen={show}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          background: 'none',
          border: 'none',
        },
      }}
    >
      <ContentBox>
        <div className="title">
          {selectContent && (
            <>
              <ContentShowerTabs tab={tab} setTab={(t) => setTab(t)} />
              <HeaderRight>
                <ContentItemActions
                  isActive
                  shareAction={() => {
                    if (shareAction) shareAction();
                  }}
                  hiddenAction={() => {
                    if (hiddenAction) hiddenAction();
                  }}
                  {...selectContent}
                />
                <ContentShowerHandles
                  isForU={!!selectContent?.isForU}
                  editorScore={selectContent?.editorScore || 0}
                  deleteAction={onAdminDelete}
                  editAction={() => {
                    navigate(`/contents/create?id=${selectContent.id}`);
                  }}
                  thumbUpAction={onAdminScore}
                  onFullscreenRequest={onToggle}
                  onFullscreenExit={onToggle}
                />
              </HeaderRight>
            </>
          )}

          <span onClick={closeModal}>
            <Close />
          </span>
        </div>
        {selectContent && (
          <ContentShowerBoxWrapper ref={ref}>
            <ContentShowerBox selectContent={selectContent} tab={tab} />
            {isFullscreen && (
              <EventLinkPreviewFullscreen
                isFullscreen={isFullscreen}
                onClick={onToggle}
              />
            )}
          </ContentShowerBoxWrapper>
        )}
      </ContentBox>
    </Modal>
  );
}

const ContentBox = styled.div`
  margin: 0 auto;
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 982px;
  height: 100%;

  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;

  & .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    & > span {
      cursor: pointer;
      padding: 10px;
    }
  }

  & h2 {
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;

    color: #ffffff;
  }

  & p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
    color: #ffffff;
  }

  & .btns {
    display: flex;
    justify-content: space-between;
    & button {
      cursor: pointer;
      width: 160px;
      height: 48px;

      background: #1a1e23;
      border: 1px solid #39424c;
      border-radius: 12px;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;

      text-align: center;

      color: #718096;
    }

    & button.confirm {
      background: #ffffff;
      color: #14171a;
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const ContentShowerBoxWrapper = styled.div`
  border: 1px solid #39424c;
  border-radius: 10px;
  height: 100%;
  overflow: hidden;
  position: relative;
`;
const EventLinkPreviewFullscreen = styled(ButtonFullScreen)`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;
