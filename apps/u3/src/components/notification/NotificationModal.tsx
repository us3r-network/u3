import styled from 'styled-components';
import { useNotificationStore } from '../../contexts/NotificationStoreCtx';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';

export default function NotificationModal() {
  const { openNotificationModal, setOpenNotificationModal } =
    useNotificationStore();

  return (
    <Wrapper open={openNotificationModal}>
      <Header>
        <Title>Notifications</Title>
        <ModalCloseBtn onClick={() => setOpenNotificationModal(false)} />
      </Header>
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
const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Title = styled.h1`
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
