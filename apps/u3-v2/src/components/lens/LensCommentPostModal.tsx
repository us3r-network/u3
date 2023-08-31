import { useCallback, useState } from 'react'
import { Post, useActiveProfile } from '@lens-protocol/react-web'
import { useLensCtx } from '../../contexts/AppLensCtx'
import ReplyModal from '../common/ReplyModal'
import { lensPublicationToPostCardData } from '../../utils/lens-ui-utils'
import { useCreateLensComment } from '../../hooks/lens/useCreateLensComment'

export default function LensCommentPostModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { commentModalData } = useLensCtx()
  const { data: activeProfile } = useActiveProfile()
  const [content, setContent] = useState('')

  const { createComment, isPending } = useCreateLensComment({
    onCommentSuccess: () => {
      closeModal()
      setContent('')
    },
  })

  const onSubmit = useCallback(async () => {
    await createComment({
      publicationId: commentModalData?.id,
      content,
    })
  }, [commentModalData?.id, content, createComment])

  return (
    <ReplyModal
      open={open}
      closeModal={closeModal}
      postData={lensPublicationToPostCardData(commentModalData as Post)}
      avatar={(activeProfile?.picture as any)?.original?.url}
      content={content}
      setContent={setContent}
      onSubmit={onSubmit}
      submitting={isPending}
    />
  )
}
