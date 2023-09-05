import { useCallback, useState } from 'react'
import { useFarcasterCtx } from '../../../contexts/FarcasterCtx'
import { CastId, makeCastAdd } from '@farcaster/hub-web'
import { toast } from 'react-toastify'
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT
} from '../../../constants/farcaster'
import { FarCast, SocailPlatform } from '../../../api'
import useFarcasterUserData from '../../../hooks/farcaster/useFarcasterUserData'
import { getCurrFid } from '../../../utils/farsign-utils'
import ReplyModal from '../ReplyModal'

export default function FCastCommentPostModal ({
  cast,
  open,
  closeModal,
  castId,
  farcasterUserData
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  open: boolean
  closeModal: (withInc?: boolean) => void
  castId: CastId
}) {
  const { encryptedSigner, currFid } = useFarcasterCtx()

  const [text, setText] = useState('')

  const [isPending, setIsPending] = useState(false)
  const commentCast = useCallback(
    async (castId: CastId) => {
      if (!text || !encryptedSigner) return
      const currFid = getCurrFid()
      setIsPending(true)
      try {
        const cast = (
          await makeCastAdd(
            {
              text,
              embeds: [],
              embedsDeprecated: [],
              mentions: [],
              mentionsPositions: [],
              parentCastId: castId
            },
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner
          )
        )._unsafeUnwrap()
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast)
        if (result.isErr()) {
          throw new Error(result.error.message)
        }
        toast.success('post created')
        closeModal(true)
      } catch (error) {
        console.error(error)
        toast.error('error creating post')
      } finally {
        setIsPending(false)
      }
    },
    [text, encryptedSigner, closeModal]
  )

  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData })
  const currUserData = useFarcasterUserData({
    fid: currFid + '',
    farcasterUserData
  })

  return (
    <ReplyModal
      open={open}
      closeModal={closeModal}
      postData={{
        platform: SocailPlatform.Farcaster,
        avatar: userData.pfp,
        name: userData.display,
        handle: userData.fid,
        createdAt: cast.created_at,
        content: cast.text
      }}
      avatar={currUserData.pfp}
      content={text}
      setContent={setText}
      onSubmit={() => {
        commentCast(castId)
      }}
      submitting={isPending}
    />
  )
}
