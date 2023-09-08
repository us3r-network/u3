import { useCallback, useState } from 'react';
import { makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { UserAvatar } from '@us3r-network/profile';
import { useFarcasterCtx } from '../../contexts/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster';
import { getCurrFid } from '../../utils/farsign-utils';

import { SocailPlatform } from '../../api';
import { useLensCtx } from '../../contexts/AppLensCtx';
import { useCreateLensPost } from '../../hooks/lens/useCreateLensPost';
import ButtonBase, { ButtonPrimaryLine } from '../common/button/ButtonBase';
import TextareaBase from '../common/input/TextareaBase';
import { SocialButtonPrimary } from './button/SocialButton';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import EmojiIcon from '../icons/EmojiIcon';
import ImgIcon from '../icons/ImgIcon';

export default function AddPostForm({ onSuccess }: { onSuccess?: () => void }) {
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
    setText('');
    if (onSuccess) onSuccess();
  }, [text, platforms, handleSubmitToFarcaster, handleSubmitToLens, onSuccess]);

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
  return (
    <Wrapper>
      <Header>
        <PlatformOptions>
          <PlatformOption
            selected={platforms.has(SocailPlatform.Lens)}
            onClick={() => onSelectPlatform(SocailPlatform.Lens)}
          >
            <LensIcon />
            Lens
          </PlatformOption>
          <PlatformOption
            selected={platforms.has(SocailPlatform.Farcaster)}
            onClick={() => onSelectPlatform(SocailPlatform.Farcaster)}
          >
            <FarcasterIcon />
            Farcaster
          </PlatformOption>
        </PlatformOptions>
        <Description>
          Post to more than one protocol cannot mention other users
        </Description>
      </Header>
      <PostBox>
        <ContentWrapper>
          <UserAvatarStyled />
          <ContentInput
            placeholder="Create a post..."
            disabled={isPending}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </ContentWrapper>

        <FooterWrapper>
          <SendImgBtn disabled>
            <ImgIcon />
          </SendImgBtn>
          <SendEmojiBtn disabled>
            <EmojiIcon />
          </SendEmojiBtn>
          <SubmitBtn
            onClick={() => {
              handleSubmit();
            }}
          >
            {isPending ? 'Posting...' : 'Post'}
          </SubmitBtn>
        </FooterWrapper>
      </PostBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  flex-shrink: 0;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Description = styled.div`
  color: #718096;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const PostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const PlatformOptions = styled.div`
  display: flex;
  gap: 10px;
`;
const PlatformOption = styled(ButtonPrimaryLine)<{ selected?: boolean }>`
  height: 24px;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  ${({ selected }) =>
    selected ? 'border: 1px solid #fff; ' : 'border: 1px dashed #9C9C9C;'}
  color: ${({ selected }) => (selected ? '#fff' : '#9C9C9C')};
`;
const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;
const UserAvatarStyled = styled(UserAvatar)`
  display: block;
`;
const ContentInput = styled(TextareaBase)`
  border: none;
  resize: vertical;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SendImgBtn = styled(ButtonBase)`
  width: 20px;
  height: 20px;
  background: #14171a;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 12px;
    height: 12px;
  }
`;
const SendEmojiBtn = styled(ButtonBase)`
  width: 20px;
  height: 20px;
  background: #14171a;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 12px;
    height: 12px;
  }
`;
const SubmitBtn = styled(SocialButtonPrimary)`
  width: 100px;
  height: 40px;
  margin-left: auto;
`;
