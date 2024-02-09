/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CastAddBody, makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import { Channelv1 } from '@mod-protocol/farcaster';
import useLogin from '@/hooks/shared/useLogin';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '@/constants/farcaster';
import FarcasterInput from '../../farcaster/FarcasterInput';
import { FCastChannelPicker } from '../../farcaster/FCastChannelPicker';
import EmbedFramePreview from './EmbedFramePreview';
import { RedEnvelopeEntity } from '@/services/frames/types/red-envelope';

export type EmbedWebsiteLink = {
  link: string;
  showPreview?: boolean;
  previewTitle?: string;
  previewImg?: string;
  previewDomain?: string;
};
export default function PostFrameForm({
  frameUrl,
  frameData,
  channel,
  defaultText,
  onSuccess,
  onBack,
}: {
  frameUrl: string;
  frameData: RedEnvelopeEntity;
  channel?: Channelv1;
  defaultText?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}) {
  const { isLogin: isLoginU3, login } = useLogin();
  const farcasterInputRef = useRef<{
    handleFarcasterSubmit: () => void;
  }>();
  const [farcasterInputText, setFarcasterInputText] = useState('');

  const {
    encryptedSigner,
    currFid: farcasterUserFid,
    getChannelFromId,
  } = useFarcasterCtx();
  const [channelValue, setChannelValue] = useState<Channelv1>({
    name: 'Home',
    parent_url: '',
    image: 'https://warpcast.com/~/channel-images/home.png',
    channel_id: 'home',
  });
  const [isPending, setIsPending] = useState(false);

  const handleSubmitToFarcaster = useCallback(
    async (castBody?: CastAddBody, c?: string[]) => {
      if (!frameUrl) return;
      if (!encryptedSigner) return;
      // const currFid = getCurrFid();
      if (!farcasterUserFid) return;
      const parentUrl = channelValue?.parent_url || undefined;

      const toChannels = (c || [])
        .map((channelId) => {
          return getChannelFromId(channelId);
        })
        .filter((item) => item !== null);

      // console.log('castBody', castBody, toChannels, parentUrl);
      try {
        setIsPending(true);
        const embedFrameLink = { url: frameUrl };
        const castBodySubmit = {
          text: castBody?.text || farcasterInputText,
          embeds: [...(castBody?.embeds || []), embedFrameLink],
          embedsDeprecated: [],
          mentions: castBody?.mentions || [],
          mentionsPositions: castBody?.mentionsPositions || [],
          parentUrl,
        };
        console.log('castBodySubmit', castBodySubmit);
        // eslint-disable-next-line no-underscore-dangle
        if (toChannels.length === 0) {
          const cast = (
            await makeCastAdd(
              castBodySubmit,
              { fid: farcasterUserFid, network: FARCASTER_NETWORK },
              encryptedSigner
            )
          )._unsafeUnwrap();
          const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
          if (result.isErr()) {
            throw new Error(result.error.message);
          }
        } else {
          const result = await Promise.all(
            toChannels.map(async (toChannel) => {
              const cast = {
                ...castBodySubmit,
                parentUrl: toChannel.parent_url,
              };
              // console.log('cast', cast);
              const r = await FARCASTER_WEB_CLIENT.submitMessage(
                (
                  await makeCastAdd(
                    cast,
                    { fid: farcasterUserFid, network: FARCASTER_NETWORK },
                    encryptedSigner
                  )
                )._unsafeUnwrap()
              );
              return r;
            })
          );
          result.forEach((r) => {
            if (r.isErr()) {
              throw new Error(r.error.message);
            }
          });
        }

        // cleanImage();
        if (onSuccess) onSuccess();
        toast.success('Red envelope released');
      } catch (error: unknown) {
        console.error(error);
        toast.error('Failed to release red envelope');
      } finally {
        setIsPending(false);
      }
    },
    [
      farcasterInputText,
      encryptedSigner,
      channel,
      channelValue,
      farcasterUserFid,
      frameUrl,
      getChannelFromId,
    ]
  );

  useEffect(() => {
    if (channel) {
      setChannelValue(channel);
    }
  }, [channel]);

  useEffect(() => {
    setFarcasterInputText(defaultText || '');
  }, [defaultText]);

  return (
    <div className="w-full flex flex-col gap-[30px]">
      <FarcasterInput
        className="w-full min-h-[80px] p-[10px] rounded-[10px] bg-[#14171A]"
        ref={farcasterInputRef}
        farcasterSubmit={handleSubmitToFarcaster}
        textCb={setFarcasterInputText}
      />
      <EmbedFramePreview frameData={frameData} />
      <div className="w-full flex justify-between items-center">
        <button
          type="button"
          className="
                flex px-[12px] py-[6px] h-[40px] justify-center items-center rounded-[10px] bg-[#FFF]
              text-[#000] text-center text-[12px] font-normal leading-[20px]
              "
          disabled={isPending}
          onClick={() => {
            onBack?.();
          }}
        >
          Back to Setting
        </button>
        <div className="flex items-center gap-[20px]">
          <FCastChannelPicker
            channelSelected={{ ...channelValue }}
            setChannelSelected={setChannelValue}
          />
          <button
            type="button"
            className="
                flex px-[12px] py-[6px] h-[40px] justify-center items-center rounded-[10px] bg-[#F41F4C]
              text-[#FFF] text-center text-[12px] font-normal leading-[20px]
              "
            disabled={isPending}
            onClick={() => {
              if (!isLoginU3) {
                login();
              } else {
                farcasterInputRef.current.handleFarcasterSubmit();
              }
            }}
          >
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
