import Modal from 'react-modal';
import styled from 'styled-components';
import { Close } from '../icons/close';
import UKarmaList, { UKarmaTitle } from '../profile/UKarmaList';

export default function KarmaModal({
  show,
  closeAction,
}: {
  show: boolean;
  closeAction: () => void;
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
          padding: '0',
          width: '360px',
        },
      }}
    >
      <ListBox>
        <div className="list-title">
          <UKarmaTitle />
          <span onClick={closeAction}>
            <Close />
          </span>
        </div>
        <div className="list-box">
          <UKarmaList />
        </div>
      </ListBox>
    </Modal>
  );
}

const ListBox = styled.div`
  position: relative;
  height: 100%;
  color: #fff;
  width: 360px;
  background: #1b1e23;
  border-radius: 20px;
  /* overflow: scroll; */

  > div.list-title {
    height: 70px;

    position: absolute;
    cursor: pointer;
    display: flex;
    top: 0;
    right: 0;
    left: 0;
    justify-content: space-between;
    align-items: center;
    > span {
      position: absolute;
      cursor: pointer;
      padding: 20px;
      right: 0;
    }
  }

  > div.list-box {
    position: absolute;
    top: 70px;
    height: calc(100% - 70px);
    width: 100%;
    overflow: scroll;
  }
`;
