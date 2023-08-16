import { useCallback, useState } from 'react'
import ModalContainer from './ModalContainer'
import { useFarcasterCtx } from '../../context/farcaster'
import { CastId } from '@farcaster/hub-web'
import { useFarcasterMakeCastWithParentCastId } from '../../hooks/useFarcaster'
import { toast } from 'react-toastify'

export default function CommentPostModal({
  open,
  closeModal,
  castId,
}: {
  open: boolean
  closeModal: () => void
  castId: CastId
}) {
  const { farcasterSigner, fid } = useFarcasterCtx()
  const { makeCastWithParentCastId } = useFarcasterMakeCastWithParentCastId({
    signer: farcasterSigner,
    fid,
  })

  const [text, setText] = useState('')

  const commentCast = useCallback(
    async (castId: CastId) => {
      if (!fid || !text) return
      try {
        const r = await makeCastWithParentCastId(text, castId)
        if (r) {
          throw new Error('error')
        }
        toast.success('post created')
        closeModal()
      } catch (error) {
        toast.error('error comment post')
      }
    },
    [fid, text, makeCastWithParentCastId, closeModal],
  )

  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setText('')}
    >
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
        <button
          onClick={() => {
            commentCast(castId)
          }}
        >
          Commit
        </button>
      </div>
    </ModalContainer>
  )
}
