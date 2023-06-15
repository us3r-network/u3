import { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Close } from '../icons/close';

export default function AddWalletModal({
  show,
  closeModal,
  confirmAction,
}: {
  show: boolean;
  closeModal: () => void;
  confirmAction: (addr: string) => Promise<boolean>;
}) {
  const [text, setText] = useState('');
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
          <h2>Add New Wallet</h2>
          <span onClick={closeModal}>
            <Close />
          </span>
        </div>
        <div className="text">
          <input
            title="text"
            type="text"
            placeholder="Wallet address"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
        <div className="btns">
          <button
            className="confirm"
            type="button"
            onClick={async () => {
              const t = text.trim();
              if (!t) return;
              const r = await confirmAction(t);
              if (r) {
                setText('');
              }
            }}
          >
            Add Wallet
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
    font-style: italic;
    color: #ffffff;
  }

  & p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
    color: #ffffff;
  }

  & .text {
    & input {
      outline: none;
      background: inherit;
      height: 48px;
      padding: 12px 16px;
      background: #1a1e23;
      border: 1px solid #39424c;
      border-radius: 12px;
      box-sizing: border-box;
      width: calc(100% - 2px);
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #fff;
      &::placeholder {
        color: #4e5a6e;
      }
    }
  }

  & .btns {
    display: flex;
    justify-content: space-between;
    & button {
      cursor: pointer;
      width: 100%;
      height: 48px;

      background: #1a1e23;
      border: 1px solid #39424c;
      border-radius: 12px;
      font-weight: 600;
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
