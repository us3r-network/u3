import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import { useNav } from '../../contexts/NavCtx';

export default function MessageModalCloseBtn() {
  const { setOpenMessageModal } = useNav();
  return <ModalCloseBtn onClick={() => setOpenMessageModal(false)} />;
}
