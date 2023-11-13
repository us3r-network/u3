import { useCallback, useState } from 'react';
import { Post } from '@lens-protocol/react-web';
// eslint-disable-next-line import/no-cycle
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import ReplyModal from '../ReplyModal';
import { lensPublicationToPostCardData } from '../../../utils/social/lens/lens-ui-utils';
import { useCreateLensComment } from '../../../hooks/social/lens/useCreateLensComment';
import getAvatar from '../../../utils/social/lens/getAvatar';

export default function LensCommentPostModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { commentModalData, sessionProfile } = useLensCtx();
  const [content, setContent] = useState('');

  const { createComment, isPending } = useCreateLensComment({
    onCommentSuccess: () => {
      closeModal();
      setContent('');
    },
  });

  const onSubmit = useCallback(async () => {
    await createComment({
      publicationId: commentModalData?.id,
      content,
    });
  }, [commentModalData?.id, content, createComment]);

  return (
    <ReplyModal
      open={open}
      closeModal={closeModal}
      postData={lensPublicationToPostCardData(commentModalData as Post)}
      avatar={getAvatar(sessionProfile)}
      content={content}
      setContent={setContent}
      onSubmit={onSubmit}
      submitting={isPending}
    />
  );
}
