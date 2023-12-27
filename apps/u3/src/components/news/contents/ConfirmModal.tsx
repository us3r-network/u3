import Modal from 'react-modal';
import styled from 'styled-components';
import { Close } from '../../common/icons/close';

export default function ConfirmModal({
  show,
  closeModal,
  confirmAction,
}: {
  show: boolean;
  closeModal: () => void;
  confirmAction: () => void;
}) {
  if (!show) return null;
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
          <h2>Hide This Content</h2>
          <span onClick={closeModal}>
            <Close />
          </span>
        </div>
        <p>Not Interested in this content？</p>
        <div className="btns">
          <button className="cancel" type="button" onClick={closeModal}>
            No, Keep it
          </button>
          <button className="confirm" type="button" onClick={confirmAction}>
            Yes, Hide it
          </button>
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
  width: 380px;

  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;

  & .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & span {
      cursor: pointer;
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
