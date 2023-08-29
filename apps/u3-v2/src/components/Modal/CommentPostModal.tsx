import { useCallback, useState } from 'react'
import ModalContainer from './ModalContainer'
import { useFarcasterCtx } from '../../contexts/FarcasterCtx'
import { CastId, makeCastAdd } from '@farcaster/hub-web'
import { toast } from 'react-toastify'
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster'
import { FarCast } from '../../api'
import useFarcasterUserData from '../../hooks/useFarcasterUserData'
import styled from 'styled-components'
import { getCurrFid } from '../../utils/farsign-utils'

export default function CommentPostModal({
  cast,
  open,
  closeModal,
  castId,
  farcasterUserData,
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  open: boolean
  closeModal: (withInc?: boolean) => void
  castId: CastId
}) {
  const { encryptedSigner, currFid } = useFarcasterCtx()

  const [text, setText] = useState('')

  const commentCast = useCallback(
    async (castId: CastId) => {
      if (!text || !encryptedSigner) return
      const currFid = getCurrFid()
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
            { fid: currFid, network: FARCASTER_NETWORK },
            encryptedSigner,
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
      }
    },
    [text, encryptedSigner, closeModal],
  )

  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData })
  const currUserData = useFarcasterUserData({
    fid: currFid + '',
    farcasterUserData,
  })

  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setText('')}
    >
      <div>
        <UserDataBox>
          <div>{userData.pfp && <img src={userData.pfp} alt="" />}</div>
          <div>
            <div>{userData.display} </div>
            <div>{userData.fid} </div>
          </div>
        </UserDataBox>
        <div>{cast.text}</div>
      </div>
      <br />
      <CommentBox>
        <div>{currUserData.pfp && <img src={currUserData.pfp} alt="" />}</div>
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
      </CommentBox>
    </ModalContainer>
  )
}

const CommentBox = styled.div`
  display: flex;
  gap: 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`

const UserDataBox = styled.div`
  display: flex;
  gap: 10px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`
