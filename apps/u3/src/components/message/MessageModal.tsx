import styled from 'styled-components';
import loadable from '@loadable/component';
import { useNav } from '../../contexts/NavCtx';

const MessageModalBody = loadable(() => import('./MessageModalBody'));

export default function MessageModal() {
  const { openMessageModal } = useNav();
  return (
    <Wrapper open={openMessageModal}>
      {openMessageModal && <MessageModalBody />}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ open: boolean }>`
  z-index: 3;

  position: absolute;
  bottom: 20px;
  right: 0px;
  transform: translateX(100%);

  display: ${({ open }) => (open ? 'block' : 'none')};
`;
