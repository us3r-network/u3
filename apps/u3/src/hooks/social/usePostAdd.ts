import { useCallback, useState } from 'react';
import { makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import ModalContainer from '../../components/common/modal/ModalContainer';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster';
// import { getCurrFid } from '../utils/farsign-utils';

import { SocialPlatform } from '../../services/social/types';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import { useCreateLensPost } from './lens/useCreateLensPost';

export default function usePostAdd({
  closeModal,
}: {
  closeModal?: () => void;
}) {
  const { encryptedSigner, isConnected, openFarcasterQR, currFid } =
    useFarcasterCtx();
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();
  const { createText: createTextToLens } = useCreateLensPost();

  const [text, setText] = useState('');
  const [platforms, setPlatforms] = useState<Set<SocialPlatform>>(new Set());
  const [isPending, setIsPending] = useState(false);

  const handleSubmitToFarcaster = useCallback(async () => {
    if (!text || !encryptedSigner || !currFid) return;
    // const currFid = getCurrFid();
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
  }, [text, encryptedSigner, currFid]);

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
    if (platforms.has(SocialPlatform.Farcaster)) {
      await handleSubmitToFarcaster();
    }
    if (platforms.has(SocialPlatform.Lens)) {
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
    (platform: SocialPlatform) => {
      switch (platform) {
        case SocialPlatform.Farcaster:
          if (!isConnected) {
            openFarcasterQR();
            return;
          }
          if (platforms.has(SocialPlatform.Farcaster)) {
            platforms.delete(SocialPlatform.Farcaster);
          } else {
            platforms.add(SocialPlatform.Farcaster);
          }
          setPlatforms(new Set(platforms));
          break;
        case SocialPlatform.Lens:
          if (!isLoginLens) {
            setOpenLensLoginModal(true);
            return;
          }
          if (platforms.has(SocialPlatform.Lens)) {
            platforms.delete(SocialPlatform.Lens);
          } else {
            platforms.add(SocialPlatform.Lens);
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
