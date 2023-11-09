import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';
import MultiPlatformShareModal from '../share/MultiPlatformShareModal';

export default function GlobalModals() {
  const { shareLinkModalState, closeShareLinkModal } = useGlobalModalsCtx();
  return (
    <>
      {' '}
      <MultiPlatformShareModal
        open={shareLinkModalState.isOpen}
        closeModal={() => closeShareLinkModal()}
      />
    </>
  );
}
