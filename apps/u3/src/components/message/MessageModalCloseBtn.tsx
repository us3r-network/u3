import { useXmtpStore } from 'src/contexts/xmtp/XmtpStoreCtx';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';

export default function MessageModalCloseBtn() {
  const { setOpenMessageModal } = useXmtpStore();
  return <ModalCloseBtn onClick={() => setOpenMessageModal(false)} />;
}
