import styled from 'styled-components';
import ModalBase, { ModalBaseBody } from '../common/modal/ModalBase';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';

export default function ModalImg({
  url,
  onAfterClose,
}: {
  url?: string;
  onAfterClose: () => void;
}) {
  return (
    <ModalBase isOpen={!!url} onAfterClose={onAfterClose}>
      <ModalBody>
        <div className="top">
          <ModalCloseBtn onClick={onAfterClose} />
        </div>
        <img src={url} alt="" />
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled.div`
  /* margin-top: 40px; */
  /* width: 976px; */
  height: 100vh;
  /* width: 100vw; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > .top {
    width: 80%;
    display: flex;
    justify-content: end;
    margin-bottom: 20px;
  }
  > img {
    width: 80%;
    max-height: 95%;
  }
`;
