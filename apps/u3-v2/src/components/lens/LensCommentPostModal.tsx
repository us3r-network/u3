import { useCallback, useState } from 'react'
import styled from 'styled-components'
import {
  CollectPolicyType,
  ContentFocus,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useActiveProfile,
  useCreateComment,
} from '@lens-protocol/react-web'
import ModalContainer from '../Modal/ModalContainer'
import InputBase from '../common/input/InputBase'
import { ButtonPrimaryLine } from '../common/button/ButtonBase'
import { lensUploadToArweave } from '../../utils/lens'
import { toast } from 'react-toastify'
import { useLensCtx } from '../../contexts/AppLensCtx'

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
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setContent('')}
    >
      <ModalBody>
        <ContentInput
          disabled={isPending}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <SubmitButton disabled={isPending} onClick={onSubmit}>
          {isPending ? 'Loading...' : '+ Comment'}
        </SubmitButton>
      </ModalBody>
    </ModalContainer>
  )
}
const ModalBody = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const ContentInput = styled(InputBase)``
const SubmitButton = styled(ButtonPrimaryLine)`
  width: 100%;
`
