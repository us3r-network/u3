import { useCallback, useState } from 'react'
import {
  CollectPolicyType,
  ContentFocus,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useActiveProfile,
  useCreateComment,
} from '@lens-protocol/react-web'
import { lensUploadToArweave } from '../../utils/lens'
import { toast } from 'react-toastify'
import { useLensCtx } from '../../contexts/AppLensCtx'
import ReplyModal from '../common/ReplyModal'
import { lensPublicationToPostCardData } from '../../utils/lens-ui-utils'

export default function LensCommentPostModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { commentModalData } = useLensCtx()
  const { data: activeProfile } = useActiveProfile()
  const publisher = activeProfile as ProfileOwnedByMe
  const [content, setContent] = useState('')
  const { execute: createComment, isPending } = useCreateComment({
    publisher,
    upload: lensUploadToArweave,
  })

  const onSubmit = useCallback(async () => {
    try {
      await createComment({
        publicationId: commentModalData?.id,
        content,
        contentFocus: ContentFocus.TEXT_ONLY,
        locale: 'en',
        collect: {
          type: CollectPolicyType.NO_COLLECT,
        },
        reference: {
          type: ReferencePolicyType.ANYONE,
        },
      })
      closeModal()
      setContent('')
      toast.success('Comment created successfully.')
    } catch (error) {
      toast.error('Failed to create comment.')
    }
  }, [commentModalData?.id, content, createComment, closeModal])

  return (
    <ReplyModal
      open={open}
      closeModal={closeModal}
      postData={lensPublicationToPostCardData(commentModalData)}
      avatar={(activeProfile?.picture as any)?.original?.url}
      content={content}
      setContent={setContent}
      onSubmit={onSubmit}
      submitting={isPending}
    />
  )
}
