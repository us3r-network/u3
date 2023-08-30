import { useCallback, useState } from 'react'
import { makeCastAdd } from '@farcaster/hub-web'
import { toast } from 'react-toastify'

import ModalContainer from './ModalContainer'
import { useFarcasterCtx } from '../../contexts/FarcasterCtx'

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster'
import { getCurrFid } from '../../utils/farsign-utils'
import styled from 'styled-components'
import { SocailPlatform } from '../../api'
import { useLensCtx } from '../../contexts/AppLensCtx'
import { useCreateLensPost } from '../../hooks/lens/useCreateLensPost'
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase'
import TextareaBase from '../common/input/TextareaBase'

export default function AddPostModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { encryptedSigner, isConnected, openFarcasterQR } = useFarcasterCtx()
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx()
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
      toast.warn('Please select a platform to publish.')
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
          <PlatformOption
            selected={platforms.has(SocailPlatform.Farcaster)}
            onClick={() => onSelectPlatform(SocailPlatform.Farcaster)}
          >
            Farcast {platforms.has(SocailPlatform.Farcaster) && '(✓)'}
          </PlatformOption>
          <PlatformOption
            selected={platforms.has(SocailPlatform.Lens)}
            onClick={() => onSelectPlatform(SocailPlatform.Lens)}
          >
            Lens {platforms.has(SocailPlatform.Lens) && '(✓)'}
          </PlatformOption>
        </PlatformOptions>
        <PostBox>
          <ContentInput
            disabled={isPending}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <SubmitBtn
            onClick={() => {
              handleSubmit()
            }}
          >
            {isPending ? 'Sharing...' : 'Share'}
          </SubmitBtn>
        </PostBox>
      </ModalBody>
    </ModalContainer>
  )
}

const ModalBody = styled.div`
  width: 730px;
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`

const PostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`
const PlatformOptions = styled.div`
  display: flex;
  gap: 10px;
`
const PlatformOption = styled(ButtonPrimaryLine)<{ selected?: boolean }>`
  width: 114px;
  height: 28px;

  border-style: ${({ selected }) => (selected ? 'solid' : 'dashed')};

  ${({ selected }) =>
    selected &&
    `
    background: #d6f16c;
    color: #000;
  `}
`
const ContentInput = styled(TextareaBase)``

const SubmitBtn = styled(ButtonPrimary)``
