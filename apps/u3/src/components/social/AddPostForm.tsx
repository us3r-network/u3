import {
  ChangeEvent,
  ClipboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserDataType, makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { UserAvatar } from '@us3r-network/profile';
import { MediaObject, useActiveProfile } from '@lens-protocol/react-web';
import { ToggleButton } from 'react-aria-components';
import { useFarcasterCtx } from '../../contexts/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster';

import { SocailPlatform } from '../../api';
import { useLensCtx } from '../../contexts/AppLensCtx';
import { useCreateLensPost } from '../../hooks/lens/useCreateLensPost';
import ButtonBase from '../common/button/ButtonBase';
import TextareaBase from '../common/input/TextareaBase';
import { SocialButtonPrimary } from './button/SocialButton';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import EmojiIcon from '../icons/EmojiIcon';
import ImgIcon from '../icons/ImgIcon';

import type {
  FilesWithId,
  ImageData,
  ImagesPreview,
} from '../../utils/social/file';
import { getImagesData } from '../../utils/social/validation';
import { ImagePreview } from './ImagePreview';
import { uploadImage } from '../../services/api/upload';
import useLogin from '../../hooks/useLogin';
import getAvatar from '../../utils/lens/getAvatar';
import { Channel } from '../../services/types/farcaster';
import ChannelSelect from './ChannelSelect';
import { getChannelFromName } from '../../utils/social/getChannel';

export default function AddPostForm({
  onSuccess,
  channel,
}: {
  onSuccess?: () => void;
  channel?: Channel;
}) {
  const { user, isLogin: isLoginU3, login } = useLogin();
  const {
    encryptedSigner,
    isConnected: isLoginFarcaster,
    currFid: farcasterUserFid,
    currUserInfo: farcasterUserInfo,
    openFarcasterQR,
  } = useFarcasterCtx();
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();
  const { data: lensUserInfo } = useActiveProfile();
  const { createPost: createPostToLens } = useCreateLensPost();

  const [channelValue, setChannelValue] = useState(
    channel?.name || channel?.channel_description || 'Home'
  );
  const [text, setText] = useState('');
  const [platforms, setPlatforms] = useState<Set<SocailPlatform>>(new Set());
  const [isPending, setIsPending] = useState(false);

  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<ImagesPreview>([]);
  const previewCount = imagesPreview.length;
  const isUploadingImages = !!previewCount;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    const isClipboardEvent = 'clipboardData' in e;

    if (isClipboardEvent) {
      const isPastingText = e.clipboardData.getData('text');
      if (isPastingText) return;
    }

    const files = isClipboardEvent ? e.clipboardData.files : e.target.files;

    const imagesData = getImagesData(files, previewCount);

    if (!imagesData) {
      toast.error('Please choose a GIF or photo up to 4');
      return;
    }

    const { imagesPreviewData, selectedImagesData } = imagesData;

    setImagesPreview([...imagesPreview, ...imagesPreviewData]);
    setSelectedImages([...selectedImages, ...selectedImagesData]);

    inputRef.current?.focus();
  };
  // remove a image
  const removeImage = (targetId: string) => (): void => {
    setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
    setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

    const { src } = imagesPreview.find(
      ({ id }) => id === targetId
    ) as ImageData;

    URL.revokeObjectURL(src);
  };
  // remove all images
  const cleanImage = (): void => {
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));

    setSelectedImages([]);
    setImagesPreview([]);
  };

  const uploadSelectedImages = async () => {
    try {
      return await Promise.all(
        selectedImages.map((image) =>
          uploadImage(image, user.token).then((result) => {
            return { url: result.data.url, mimeType: image.type }; // convert to Embed for farcaster or MediaObject for lens
          })
        )
      );
    } catch (e) {
      console.log(e);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmitToFarcaster = useCallback(async () => {
    if (!text || !encryptedSigner) return;
    // const currFid = getCurrFid();
    if (!farcasterUserFid) return;
    let parentUrl;
    if (channelValue !== 'Home') {
      const ch = getChannelFromName(channelValue);
      parentUrl = ch?.parent_url;
    }
    try {
      const uploadedLinks = await uploadSelectedImages();
      // eslint-disable-next-line no-underscore-dangle
      const cast = (
        await makeCastAdd(
          {
            text,
            embeds: [...uploadedLinks],
            embedsDeprecated: [],
            mentions: [],
            mentionsPositions: [],
            parentUrl,
          },
          { fid: farcasterUserFid, network: FARCASTER_NETWORK },
          encryptedSigner
        )
      )._unsafeUnwrap();
      const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
      toast.success('successfully posted to farcaster');
    } catch (error: unknown) {
      console.error(error);
      toast.error('failed to post to farcaster');
    }
  }, [text, encryptedSigner, channel, channelValue, farcasterUserFid]);

  const handleSubmitToLens = useCallback(async () => {
    if (!text) return;
    try {
      const media = await uploadSelectedImages();
      await createPostToLens(text, media as MediaObject[]);
      toast.success('successfully posted to lens');
    } catch (error: unknown) {
      console.error(error);
      toast.error('failed to post to lens');
    }
  }, [text, createPostToLens]);

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
    cleanImage();
    if (onSuccess) onSuccess();
  }, [text, platforms, handleSubmitToFarcaster, handleSubmitToLens, onSuccess]);

  useEffect(() => {
    if (channel) {
      setChannelValue(channel.name || channel.channel_description || 'Home');
    }
  }, [channel]);

  return (
    <Wrapper>
      <Header>
        {isLoginU3 ? (
          <PlatformOptions>
            <PlatformOption>
              {isLoginFarcaster && farcasterUserInfo ? (
                <PlatformToggleButton
                  isSelected={platforms.has(SocailPlatform.Farcaster)}
                  platform={SocailPlatform.Farcaster}
                  onChange={() => {
                    if (platforms.has(SocailPlatform.Farcaster)) {
                      platforms.delete(SocailPlatform.Farcaster);
                    } else {
                      platforms.add(SocailPlatform.Farcaster);
                    }
                    setPlatforms(new Set(platforms));
                  }}
                >
                  <Avatar
                    src={
                      farcasterUserInfo[farcasterUserFid]?.find(
                        (item) => item.type === UserDataType.PFP
                      )?.value || ''
                    }
                  />
                  <UserName>
                    {farcasterUserInfo[farcasterUserFid]?.find(
                      (item) => item.type === UserDataType.DISPLAY
                    )?.value || ''}
                  </UserName>
                  <UserHandle>
                    @
                    {farcasterUserInfo[farcasterUserFid]?.find(
                      (item) => item.type === UserDataType.USERNAME
                    )?.value || ''}
                  </UserHandle>
                  <FarcasterIcon />
                </PlatformToggleButton>
              ) : (
                <LoginWraper>
                  <FarcasterIcon />
                  Farcaster
                  <LoginButton onClick={() => openFarcasterQR()}>
                    login
                  </LoginButton>
                </LoginWraper>
              )}
            </PlatformOption>
            <PlatformOption>
              {isLoginLens ? (
                <PlatformToggleButton
                  isSelected={platforms.has(SocailPlatform.Lens)}
                  platform={SocailPlatform.Lens}
                  onChange={() => {
                    if (platforms.has(SocailPlatform.Lens)) {
                      platforms.delete(SocailPlatform.Lens);
                    } else {
                      platforms.add(SocailPlatform.Lens);
                    }
                    setPlatforms(new Set(platforms));
                  }}
                >
                  <Avatar src={getAvatar(lensUserInfo)} />
                  <UserName>{lensUserInfo.name}</UserName>
                  <UserHandle>@{lensUserInfo.handle}</UserHandle>
                  <LensIcon />
                </PlatformToggleButton>
              ) : (
                <LoginWraper>
                  <LensIcon />
                  Lens
                  <LoginButton onClick={() => setOpenLensLoginModal(true)}>
                    login
                  </LoginButton>
                </LoginWraper>
              )}
            </PlatformOption>
          </PlatformOptions>
        ) : (
          <LoginButton onClick={() => login()}>login</LoginButton>
        )}
      </Header>
      <PostBox>
        <UserPostWrapepr>
          {/* <UserAvatarStyled /> */}
          <ContentWrapper>
            <ContentInput
              placeholder="Create a post..."
              disabled={!isLoginU3 || isPending}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPaste={handleImageUpload}
            />
            {isUploadingImages && (
              <ImagePreview
                imagesPreview={imagesPreview}
                removeImage={removeImage}
              />
            )}
          </ContentWrapper>
        </UserPostWrapepr>
        <FooterWrapper>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={inputFileRef}
            multiple
            hidden
          />
          <SendImgBtn
            disabled={!isLoginU3}
            onClick={() => inputFileRef.current?.click()}
          >
            <ImgIcon />
          </SendImgBtn>
          <SendEmojiBtn disabled>
            <EmojiIcon />
          </SendEmojiBtn>

          <ChannelSelect
            channel={channel}
            selectChannelName={channelValue}
            setSelectChannelName={(v) => {
              setChannelValue(v);
            }}
          />
          <Description
            hidden={
              !(
                platforms.has(SocailPlatform.Lens) &&
                platforms.has(SocailPlatform.Farcaster)
              )
            }
          >
            Post to more than one protocol cannot mention other users
          </Description>
          <SubmitBtn
            disabled={text === '' || platforms.size === 0}
            onClick={() => {
              if (!isLoginU3) {
                login();
              } else {
                handleSubmit();
              }
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
const Description = styled.div`
  color: #718096;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-left: auto;
`;
const PostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const PlatformOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;
const PlatformOption = styled.div`
  display: flex;
  max-width: 100%;
`;
const LoginWraper = styled.div`
  display: flex;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 0;
  padding-left: 6px;
  font-size: 12px;
  border: 1px dashed #9c9c9c;
  color: #fff;
`;
const LoginButton = styled(SocialButtonPrimary)`
  width: 60px;
  height: 24px;
  font-size: 12px;
  font-weight: 400;
`;
const PlatformToggleButton = styled(ToggleButton)<{
  platform?: SocailPlatform;
}>`
  max-width: 100%;
  cursor: pointer;
  outline: none;
  /* height: 24px; */
  padding: 0;
  padding-right: 6px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background-color: #000;
  border: 1px dashed #9c9c9c;
  color: #9c9c9c;
  &[data-selected] {
    border: 1px solid;
    border-color: ${({ platform }) =>
      platform === SocailPlatform.Lens ? '#9BEA1D' : '#825DC5'};
    color: ${({ platform }) =>
      platform === SocailPlatform.Lens ? '#9BEA1D' : '#825DC5'};
  }
`;
const Avatar = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`;
const UserName = styled.label`
  font-weight: 600;
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const UserHandle = styled.label`
  opacity: 0.5;
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const UserPostWrapepr = styled.div`
  display: flex;
  gap: 10px;
`;
const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
// const UserAvatarStyled = styled(UserAvatar)`
//   display: block;
// `;
const ContentInput = styled(TextareaBase)`
  padding: 10px;
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

const ChannelBox = styled.div`
  color: #718096;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  .channel-img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
`;
