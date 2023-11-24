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
  width: 400px;
  height: 760px;
  max-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;

  position: absolute;
  bottom: 20px;
  right: -10px;
  transform: translateX(100%);

  display: ${({ open }) => (open ? 'block' : 'none')};
`;
