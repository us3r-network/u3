import styled from 'styled-components';

import ModalContainer from '../common/modal/ModalContainer';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import AddPostForm from './AddPostForm';

export default function AddPostModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  return (
    <ModalContainer open={open} closeModal={closeModal} zIndex={100}>
      <ModalBody>
        <CloseBtn onClick={closeModal} />
        <AddPostForm onSuccess={closeModal} />
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  width: fit-content;
  /* min-height: 194px; */
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;

  position: relative;
`;
const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 20px;
  right: 20px;
`;
