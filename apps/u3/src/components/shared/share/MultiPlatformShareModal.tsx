import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import ModalContainer from '../../common/modal/ModalContainer';
import { ModalCloseBtn } from '../../common/modal/ModalWidgets';
import AddPostForm from '../../social/AddPostForm';
import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';

export default function MultiPlatformShareModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { shareLinkModalState } = useGlobalModalsCtx();
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      zIndex={100}
      contentTop="30%"
    >
      <ModalBody isMobile={isMobile}>
        <CloseBtn onClick={closeModal} />
        <AddPostForm
          onSuccess={closeModal}
          isShareForm
          shareData={shareLinkModalState}
        />
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div<{ isMobile?: boolean }>`
  width: ${(props) => (props.isMobile ? 'fit-content' : '600px')};
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