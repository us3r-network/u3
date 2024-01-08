import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import ModalContainer from 'src/components/common/modal/ModalContainer';
import { ModalCloseBtn } from 'src/components/common/modal/ModalWidgets';
import LinkPreview from './LinkPreview';

export default function LinkModal({
  show,
  closeModal,
  data,
}: {
  show: boolean;
  closeModal: () => void;
  data: LinkListItem | null;
}) {
  return (
    <ModalContainer open={show} closeModal={closeModal}>
      <ModalBody>
        {data && <LinkPreview data={data} />}
        <CloseBtn onClick={closeModal} />
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  margin: 0 auto;
  display: relative;
  width: 982px;
  height: 90vh;

  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
`;
const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 20px;
  right: 20px;
`;
