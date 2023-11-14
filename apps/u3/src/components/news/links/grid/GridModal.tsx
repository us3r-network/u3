import Modal from 'react-modal';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { Close } from '../../../common/icons/close';
import LinkPreview from '../LinkPreview';

export default function GridModal({
  show,
  closeModal,
  data,
}: {
  show: boolean;
  closeModal: () => void;
  data: LinkListItem | null;
}) {
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
          {data && <LinkPreview data={data} />}

          <span onClick={closeModal}>
            <Close />
          </span>
        </div>
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
