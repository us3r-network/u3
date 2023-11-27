/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-27 16:56:12
 * @FilePath: /u3/apps/u3/src/components/shared/modal/GlobalModals.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';
import MultiPlatformCommentModal from '../share/MultiPlatformCommentModal';
import MultiPlatformShareModal from '../share/MultiPlatformShareModal';

export default function GlobalModals() {
  const { shareLinkModalState, closeShareLinkModal } = useGlobalModalsCtx();
  const { commentLinkModalState, closeCommentLinkModal } = useGlobalModalsCtx();
  return (
    <>
      {' '}
      <MultiPlatformShareModal
        open={shareLinkModalState.isOpen}
        closeModal={() => closeShareLinkModal()}
      />
      <MultiPlatformCommentModal
        open={commentLinkModalState.isOpen}
        closeModal={() => closeCommentLinkModal()}
      />
    </>
  );
}
