import styled from 'styled-components';
import { useXmtpStore } from 'src/contexts/xmtp/XmtpStoreCtx';
import { ReactComponent as Close } from '../common/icons/svgs/close.svg';

export default function MessageModalCloseBtn() {
  const { setOpenMessageModal } = useXmtpStore();
  return (
    <MessageModalCloseBtnWrapper onClick={() => setOpenMessageModal(false)}>
      <Close />
    </MessageModalCloseBtnWrapper>
  );
}
const MessageModalCloseBtnWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #14171a;
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
  }
`;
