import { useCallback, useState } from 'react'
import ModalContainer from './ModalContainer'
import { useFarcasterMakeCast } from '../../hooks/useFarcaster'
import { useFarcasterCtx } from '../../context/farcaster'
import { toast } from 'react-toastify'

export default function AddPostModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { farcasterSigner, fid } = useFarcasterCtx()

  const [text, setText] = useState('')

  const { makeCast } = useFarcasterMakeCast({ fid, signer: farcasterSigner })

  const handleSubmit = useCallback(async () => {
    if (!fid || !text) return
    try {
      const r = await makeCast(text)
      if (r) {
        throw new Error('error')
      }
      toast.success('post created')
      closeModal()
    } catch (error) {
      toast.error('error creating post')
    }
  }, [fid, makeCast, text, closeModal])

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
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSubmit}>post</button>
      </div>
    </ModalContainer>
  )
}
