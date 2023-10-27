import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import LensCommentPostModal from './LensCommentPostModal';
import LensLoginModal from './LensLoginModal';

export default function LensGlobalModals() {
  const {
    openLensLoginModal,
    setOpenLensLoginModal,
    openCommentModal,
    setOpenCommentModal,
  } = useLensCtx();
  return (
    <>
      {' '}
      <LensLoginModal
        open={openLensLoginModal}
        closeModal={() => setOpenLensLoginModal(false)}
      />
      <LensCommentPostModal
        open={openCommentModal}
        closeModal={() => setOpenCommentModal(false)}
      />
    </>
  );
}
