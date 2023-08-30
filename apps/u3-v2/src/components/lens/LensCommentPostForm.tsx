import { useCallback, useState } from 'react'
import {
  CollectPolicyType,
  ContentFocus,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useActiveProfile,
  useCreateComment,
  publicationId,
} from '@lens-protocol/react-web'
import { lensUploadToArweave } from '../../utils/lens'
import { toast } from 'react-toastify'
import ReplyForm from '../common/ReplyForm'
import { useLensCtx } from '../../contexts/AppLensCtx'

export default function LensCommentPostForm({
  publicationId: pid,
  canComment,
}: {
  publicationId: string
  canComment?: boolean
}) {
  const { isLogin, setOpenLensLoginModal } = useLensCtx()
  const { data: activeProfile } = useActiveProfile()
  const publisher = activeProfile as ProfileOwnedByMe
  const [content, setContent] = useState('')
  const { execute: createComment, isPending } = useCreateComment({
    publisher,
    upload: lensUploadToArweave,
  })

  const onSubmit = useCallback(async () => {
    if (!isLogin) {
      setOpenLensLoginModal(true)
      return
    }
    if (!canComment) {
      toast.error('No comment permission')
      return
    }
    try {
      await createComment({
        publicationId: publicationId(pid),
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
      setContent('')
      toast.success('Comment created successfully.')
    } catch (error) {
      toast.error('Failed to create comment.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, content, createComment, isLogin, canComment])

  return (
    <ReplyForm
      onClick={() => {}}
      avatar={(activeProfile?.picture as any)?.original?.url}
      content={content}
      setContent={setContent}
      submitting={isPending}
      onSubmit={onSubmit}
    />
  )
}
