import { useCallback, useState } from 'react'
import { makeCastAdd } from '@farcaster/hub-web'
import { toast } from 'react-toastify'

import ModalContainer from './ModalContainer'
import { useFarcasterCtx } from '../../contexts/FarcasterCtx'

import { FARCASTER_CLIENT_NAME } from '../../constants/farcaster'

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster'
import { getCurrFid } from '../../utils/farsign-utils'
import useFarcasterUserData from '../../hooks/useFarcasterUserData'
import styled from 'styled-components'
import { SocailPlatform } from '../../api'
import { useLensAuth } from '../../contexts/AppLensCtx'
import { useCreateLensPost } from '../../hooks/lens/useCreateLensPost'

export default function AddPostModal({
  open,
  closeModal,
  farcasterUserData,
}: {
  open: boolean
  closeModal: () => void
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
}) {
  const { encryptedSigner, currFid, isConnected, openFarcasterQR } =
    useFarcasterCtx()
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensAuth()
  const { createText: createTextToLens } = useCreateLensPost()

  const [text, setText] = useState('')
  const [platforms, setPlatforms] = useState<Set<SocailPlatform>>(new Set())
  const [isPending, setIsPending] = useState(false)

  const handleSubmitToFarcaster = useCallback(async () => {
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
      toast.success('successfully posted to farcaster')
    } catch (error: any) {
      console.error(error)
      toast.error('failed to post to farcaster')
    }
  }, [text, encryptedSigner])

  const handleSubmitToLens = useCallback(async () => {
    try {
      await createTextToLens(text)
      toast.success('successfully posted to lens')
    } catch (error: any) {
      console.error(error)
      toast.error('failed to post to lens')
    }
  }, [text, createTextToLens])

  const handleSubmit = useCallback(async () => {
    if (!platforms.size) {
      toast.error('Please select a platform to publish.')
      return
    }
    setIsPending(true)
    if (platforms.has(SocailPlatform.Farcaster)) {
      await handleSubmitToFarcaster()
    }
    if (platforms.has(SocailPlatform.Lens)) {
      await handleSubmitToLens()
    }
    setIsPending(false)
    closeModal()
  }, [platforms, handleSubmitToFarcaster, handleSubmitToLens, closeModal])

  const currUserData = useFarcasterUserData({
    fid: currFid + '',
    farcasterUserData,
  })

  const onSelectPlatform = useCallback(
    (platform: SocailPlatform) => {
      switch (platform) {
        case SocailPlatform.Farcaster:
          if (!isConnected) {
            openFarcasterQR()
            return
          }
          if (platforms.has(SocailPlatform.Farcaster)) {
            platforms.delete(SocailPlatform.Farcaster)
          } else {
            platforms.add(SocailPlatform.Farcaster)
          }
          setPlatforms(new Set(platforms))
          break
        case SocailPlatform.Lens:
          if (!isLoginLens) {
            setOpenLensLoginModal(true)
            return
          }
          if (platforms.has(SocailPlatform.Lens)) {
            platforms.delete(SocailPlatform.Lens)
          } else {
            platforms.add(SocailPlatform.Lens)
          }
          setPlatforms(new Set(platforms))
          break
      }
    },
    [
      platforms,
      isConnected,
      openFarcasterQR,
      isLoginLens,
      setOpenLensLoginModal,
    ],
  )
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setText('')}
      zIndex={100}
    >
      <ModalBody>
        <PlatformOptions>
          <button onClick={() => onSelectPlatform(SocailPlatform.Farcaster)}>
            Farcast {platforms.has(SocailPlatform.Farcaster) && '(✓)'}
          </button>
          <button onClick={() => onSelectPlatform(SocailPlatform.Lens)}>
            Lens {platforms.has(SocailPlatform.Lens) && '(✓)'}
          </button>
        </PlatformOptions>
        <PostBox>
          <div>{currUserData.pfp && <img src={currUserData.pfp} alt="" />}</div>
          <input
            type="text"
            disabled={isPending}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => {
              handleSubmit()
            }}
          >
            {isPending ? 'posting...' : 'post'}
          </button>
        </PostBox>
      </ModalBody>
    </ModalContainer>
  )
}

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const PostBox = styled.div`
  display: flex;
  gap: 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`
const PlatformOptions = styled.div`
  display: flex;
  gap: 10px;
`
