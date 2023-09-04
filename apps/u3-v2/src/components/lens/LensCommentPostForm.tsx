import { useCallback, useState } from 'react'
import { useActiveProfile } from '@lens-protocol/react-web'
import { toast } from 'react-toastify'
import ReplyForm from '../common/ReplyForm'
import { useLensCtx } from '../../contexts/AppLensCtx'
import { useCreateLensComment } from '../../hooks/lens/useCreateLensComment'
import getAvatar from '../../utils/lens/getAvatar'

export default function LensCommentPostForm({
  publicationId,
  canComment,
}: {
  publicationId: string
  canComment?: boolean
}) {
  const [content, setContent] = useState('')

  const { isLogin, setOpenLensLoginModal } = useLensCtx()
  const { data: activeProfile } = useActiveProfile()

  const { createComment, isPending } = useCreateLensComment({
    onCommentSuccess: () => {
      setContent('')
    },
  })

  const onSubmit = useCallback(async () => {
    if (!isLogin) {
      setOpenLensLoginModal(true)
      return
    }
    if (!content) {
      toast.warn('Please input comment content.')
      return
    }
    if (!canComment) {
      toast.error('No comment permission')
      return
    }
    await createComment({
      publicationId,
      content,
    })
  }, [
    isLogin,
    canComment,
    publicationId,
    content,
    createComment,
    setOpenLensLoginModal,
  ])

  return (
    <ReplyForm
      onClick={() => {}}
      avatar={getAvatar(activeProfile)}
      content={content}
      setContent={setContent}
      submitting={isPending}
      onSubmit={onSubmit}
    />
  )
}
