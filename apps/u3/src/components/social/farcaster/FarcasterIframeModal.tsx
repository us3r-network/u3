import ModalContainer from 'src/components/common/modal/ModalContainer';
import styled from 'styled-components';

export default function FarcasterIframeModal({
  iframeUrl,
  open,
  closeModal,
  afterCloseAction,
}: {
  iframeUrl: string;
  open: boolean;
  closeModal: () => void;
  afterCloseAction: () => void;
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={afterCloseAction}
    >
      <ModalBody>
        {iframeUrl && <iframe src={iframeUrl} title="farcaster v3" />}
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  width: 730px;
  /* height: 220px; */
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 30px;
`;
