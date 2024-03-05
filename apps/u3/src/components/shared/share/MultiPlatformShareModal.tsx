import styled from 'styled-components';

import ModalContainer from '../../common/modal/ModalContainer';
import { ModalCloseBtn } from '../../common/modal/ModalWidgets';
import AddPostForm from '../../social/AddPostForm';
import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';
import { cn } from '@/lib/utils';

export default function MultiPlatformShareModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { shareLinkModalState } = useGlobalModalsCtx();
  const {
    platforms,
    shareLink,
    shareLinkDefaultPlatform,
    shareLinkDefaultText,
    shareLinkEmbedTitle,
    shareLinkEmbedImg,
    shareLinkDomain,
    onSubmitEnd,
  } = shareLinkModalState || {};
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      zIndex={30}
      contentTop="60px"
      contentTransform="translateX(-50%)"
    >
      <div
        className={cn(
          'w-[600px] flex-shrink-0 p-[20px] box-border flex flex-col justify-between gap-[20px] relative',
          'max-sm:w-[96vw]'
        )}
      >
        <ModalCloseBtn
          className="absolute top-[20px] right-[20px]"
          onClick={closeModal}
        />
        <AddPostForm
          onSuccess={() => {
            closeModal();
            onSubmitEnd?.();
          }}
          selectedPlatforms={platforms || [shareLinkDefaultPlatform]}
          defaultText={shareLinkDefaultText}
          embedWebsiteLink={{
            link: shareLink,
            showPreview:
              !!shareLinkEmbedTitle || !!shareLinkEmbedImg || !!shareLinkDomain,
            previewTitle: shareLinkEmbedTitle,
            previewImg: shareLinkEmbedImg,
            previewDomain: shareLinkDomain,
          }}
        />
      </div>
    </ModalContainer>
  );
}
