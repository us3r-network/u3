import { useCallback, useState } from 'react';
import { useActiveProfile } from '@lens-protocol/react-web';
import { toast } from 'react-toastify';
import ReplyForm from '../ReplyForm';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import { useCreateLensComment } from '../../../hooks/social/lens/useCreateLensComment';
import getAvatar from '../../../utils/social/lens/getAvatar';
import useLogin from '../../../hooks/shared/useLogin';

export default function LensCommentPostForm({
  publicationId,
  canComment,
}: {
  publicationId: string;
  canComment?: boolean;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const [content, setContent] = useState('');

  const { isLogin, setOpenLensLoginModal } = useLensCtx();
  const { data: activeProfile } = useActiveProfile();

  const { createComment, isPending } = useCreateLensComment({
    onCommentSuccess: () => {
      setContent('');
    },
  });

  const onSubmit = useCallback(async () => {
    if (!isLoginU3) {
      loginU3();
      return;
    }
    if (!isLogin) {
      setOpenLensLoginModal(true);
      return;
    }
    if (!content) {
      toast.warn('Please input comment content.');
      return;
    }
    if (!canComment) {
      toast.error('No comment permission');
      return;
    }
    await createComment({
      publicationId,
      content,
    });
  }, [
    isLoginU3,
    loginU3,
    isLogin,
    canComment,
    publicationId,
    content,
    createComment,
    setOpenLensLoginModal,
  ]);

  return (
    <ReplyForm
      disabled={!canComment}
      onClick={() => {}}
      avatar={getAvatar(activeProfile)}
      content={content}
      setContent={setContent}
      submitting={isPending}
      onSubmit={onSubmit}
    />
  );
}
