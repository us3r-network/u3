import { useCallback, useState } from 'react'
import ModalContainer from './ModalContainer'
import { useFarcasterCtx } from '../../contexts/farcaster'
import { CastId, makeCastAdd } from '@farcaster/hub-web'
import { toast } from 'react-toastify'
import { FARCASTER_CLIENT_NAME } from '../../constants/farcaster'
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster'

export default function CommentPostModal({
  open,
  closeModal,
  castId,
}: {
  open: boolean
  closeModal: () => void
  castId: CastId
}) {
  const { encryptedSigner } = useFarcasterCtx()

  const [text, setText] = useState('')

  const commentCast = useCallback(
    async (castId: CastId) => {
      if (!text || !encryptedSigner) return
      const request = JSON.parse(
        localStorage.getItem('farsign-signer-' + FARCASTER_CLIENT_NAME)!,
      ).signerRequest
      try {
        const cast = (
          await makeCastAdd(
            {
              text,
              embeds: [],
              embedsDeprecated: [],
              mentions: [],
              mentionsPositions: [],
              parentCastId: castId,
            },
            { fid: request.fid, network: FARCASTER_NETWORK },
            encryptedSigner,
          )
        )._unsafeUnwrap()
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast)
        if (result.isErr()) {
          throw new Error(result.error.message)
        }
        toast.success('post created')
        closeModal()
      } catch (error) {
        console.error(error)
        toast.error('error creating post')
      }
    },
    [text, encryptedSigner, closeModal],
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
          Comment
        </button>
      </div>
    </ModalContainer>
  )
}
