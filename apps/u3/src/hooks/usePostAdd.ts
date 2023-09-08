import { useCallback, useState } from 'react';
import { makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import ModalContainer from '../components/common/modal/ModalContainer';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../constants/farcaster';
import { getCurrFid } from '../utils/farsign-utils';

import { SocailPlatform } from '../api';
import { useLensCtx } from '../contexts/AppLensCtx';
import { useCreateLensPost } from './lens/useCreateLensPost';

export default function usePostAdd({
  closeModal,
}: {
  closeModal?: () => void;
}) {
  const { encryptedSigner, isConnected, openFarcasterQR } = useFarcasterCtx();
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();
  const { createText: createTextToLens } = useCreateLensPost();

  const [text, setText] = useState('');
  const [platforms, setPlatforms] = useState<Set<SocailPlatform>>(new Set());
  const [isPending, setIsPending] = useState(false);

  const handleSubmitToFarcaster = useCallback(async () => {
    if (!text || !encryptedSigner) return;
    const currFid = getCurrFid();
    try {
      // eslint-disable-next-line no-underscore-dangle
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
          encryptedSigner
        )
      )._unsafeUnwrap();
      const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
      toast.success('successfully posted to farcaster');
    } catch (error: any) {
      console.error(error);
      toast.error('failed to post to farcaster');
    }
  }, [text, encryptedSigner]);

  const handleSubmitToLens = useCallback(async () => {
    if (!text) return;
    try {
      await createTextToLens(text);
      toast.success('successfully posted to lens');
    } catch (error: any) {
      console.error(error);
      toast.error('failed to post to lens');
    }
  }, [text, createTextToLens]);

  const handleSubmit = useCallback(async () => {
    if (!text) {
      toast.warn('Please input text to publish.');
      return;
    }
    if (!platforms.size) {
      toast.warn('Please select a platform to publish.');
      return;
    }
    setIsPending(true);
    if (platforms.has(SocailPlatform.Farcaster)) {
      await handleSubmitToFarcaster();
    }
    if (platforms.has(SocailPlatform.Lens)) {
      await handleSubmitToLens();
    }
    setIsPending(false);
    if (closeModal) closeModal();
  }, [
    text,
    platforms,
    handleSubmitToFarcaster,
    handleSubmitToLens,
    closeModal,
  ]);

  const onSelectPlatform = useCallback(
    (platform: SocailPlatform) => {
      switch (platform) {
        case SocailPlatform.Farcaster:
          if (!isConnected) {
            openFarcasterQR();
            return;
          }
          if (platforms.has(SocailPlatform.Farcaster)) {
            platforms.delete(SocailPlatform.Farcaster);
          } else {
            platforms.add(SocailPlatform.Farcaster);
          }
          setPlatforms(new Set(platforms));
          break;
        case SocailPlatform.Lens:
          if (!isLoginLens) {
            setOpenLensLoginModal(true);
            return;
          }
          if (platforms.has(SocailPlatform.Lens)) {
            platforms.delete(SocailPlatform.Lens);
          } else {
            platforms.add(SocailPlatform.Lens);
          }
          setPlatforms(new Set(platforms));
          break;
        default:
          console.error('unknown platform', platform);
          break;
      }
    },
    [
      platforms,
      isConnected,
      openFarcasterQR,
      isLoginLens,
      setOpenLensLoginModal,
    ]
  );
  return {
    text,
    setText,
    platforms,
    onSelectPlatform,
    handleSubmit,
    isPending,
  };
}
