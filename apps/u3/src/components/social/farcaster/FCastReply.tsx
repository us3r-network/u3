/* eslint-disable no-underscore-dangle */
import { useCallback, useRef, useState } from 'react';
import { Channelv1 } from '@mod-protocol/farcaster';
import { CastAddBody } from '@farcaster/hub-web';

import { CurrentUserInfoAvatar } from '@/components/social/farcaster/CurrUserInfo';
import useLogin from '@/hooks/shared/useLogin';

import { FCastChannelPicker } from '@/components/social/farcaster/FCastChannelPicker';
import FarcasterInput from '@/components/social/farcaster/FarcasterInput';
import ColorButton from '@/components/common/button/ColorButton';

export function ReplyCast({
  replyAction,
}: {
  replyAction: (data: {
    cast: CastAddBody;
    channel: Channelv1;
  }) => Promise<void>;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const farcasterInputRef = useRef<{
    handleFarcasterSubmit: () => void;
  }>();
  const [channelSelected, setChannelSelected] = useState<Channelv1>({
    name: 'Home',
    parent_url: '',
    image: 'https://warpcast.com/~/channel-images/home.png',
    channel_id: 'home',
  });
  const [isPending, setIsPending] = useState(false);
  const [, setFarcasterInputText] = useState('');
  const handleSubmitToFarcaster = useCallback(
    async (castBody: CastAddBody) => {
      console.log(castBody, channelSelected);
      setIsPending(true);
      try {
        await replyAction({ cast: castBody, channel: channelSelected });
      } catch (error) {
        console.error(error);
      } finally {
        setIsPending(false);
      }
    },
    [channelSelected]
  );
  return (
    <div className="flex gap-3 w-full">
      <div>
        <CurrentUserInfoAvatar />
      </div>
      <div className="flex flex-grow flex-col gap-3">
        <FarcasterInput
          ref={farcasterInputRef}
          farcasterSubmit={handleSubmitToFarcaster}
          textCb={setFarcasterInputText}
          className="bg-[#14171A] border-none p-[10px] rounded-[10px]"
        />
        <div className="flex items-center">
          <FCastChannelPicker
            channelSelected={channelSelected}
            setChannelSelected={setChannelSelected}
            disabled
          />
          <div className="flex-grow" />
          <ColorButton
            className="h-10 rounded-[10px] text-[16px]"
            onClick={() => {
              if (!isLoginU3) {
                loginU3();
                return;
              }
              farcasterInputRef.current?.handleFarcasterSubmit();
            }}
          >
            Reply
          </ColorButton>
        </div>
      </div>
    </div>
  );
}
