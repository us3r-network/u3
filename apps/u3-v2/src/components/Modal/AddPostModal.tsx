import { useCallback, useState } from 'react'
import { makeCastAdd } from '@farcaster/hub-web'
import { toast } from 'react-toastify'

import ModalContainer from './ModalContainer'
import { useFarcasterCtx } from '../../contexts/farcaster'

import { FARCASTER_CLIENT_NAME } from '../../constants/farcaster'

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster'
import { getCurrFid } from '../../utils/farsign-utils'
import useFarcasterUserData from '../../hooks/useFarcasterUserData'
import styled from 'styled-components'

export default function AddPostModal({
  open,
  closeModal,
  farcasterUserData,
}: {
  open: boolean
  closeModal: () => void
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
}) {
  const { encryptedSigner, currFid } = useFarcasterCtx()
  const [text, setText] = useState('')

  const handleSubmit = useCallback(async () => {
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
      closeModal()
    } catch (error) {
      console.error(error)
      toast.error('error creating post')
    }
  }, [text, encryptedSigner, closeModal])

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
      <PostBox>
        <div>{currUserData.pfp && <img src={currUserData.pfp} alt="" />}</div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={() => {
            handleSubmit()
          }}
        >
          post
        </button>
      </PostBox>
    </ModalContainer>
  )
}

const PostBox = styled.div`
  display: flex;
  gap: 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`
