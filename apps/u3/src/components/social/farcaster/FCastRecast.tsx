/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
import { CastAddBody, CastId, makeCastAdd } from '@farcaster/hub-web';
import { Channelv1 } from '@mod-protocol/farcaster';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { LoopIcon, Pencil2Icon, Cross2Icon } from '@radix-ui/react-icons';

import { FarCast } from '../../../services/social/types';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../../constants/farcaster';
import useFarcasterCastId from '../../../hooks/social/farcaster/useFarcasterCastId';
import useLogin from '../../../hooks/shared/useLogin';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { UserData } from '@/utils/social/farcaster/user-data';
import FCastText from './FCastText';
import FCastTitle from './FCastTitle';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import { CurrentUserInfoAvatar } from './CurrUserInfo';
import FarcasterInput from './FarcasterInput';
import { FCastChannelPicker } from './FCastChannelPicker';
import { Button } from '@/components/ui/button';
import ModalContainer from '@/components/common/modal/ModalContainer';
import useFarcasterRecastAction from '@/hooks/social/farcaster/useFarcasterRecastAction';

export default function FCastRecast({
  cast,
  openFarcasterQR,
  farcasterUserDataObj,
  onRecastSuccess,
  onRemoveRecastSuccess,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
  onRecastSuccess?: () => void;
  onRemoveRecastSuccess?: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { isConnected } = useFarcasterCtx();
  const { recast, removeRecast, recastCount, recasted } =
    useFarcasterRecastAction({ cast, onRecastSuccess, onRemoveRecastSuccess });

  // const currFid: string = useFarcasterCurrFid();
  const castId: CastId = useFarcasterCastId({ cast });

  return (
    <Repost
      cast={cast}
      farcasterUserDataObj={farcasterUserDataObj}
      reposted={recasted}
      repostCount={recastCount}
      repostAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (!isConnected) {
          openFarcasterQR();
          return;
        }
        if (recasted) {
          removeRecast(castId);
        } else {
          recast(castId);
        }
      }}
    />
  );
}

function Repost({
  cast,
  farcasterUserDataObj,
  reposted,
  repostCount,
  repostAction,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
  reposted: boolean;
  repostCount: number;
  repostAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const castId: CastId = useFarcasterCastId({ cast });
  const {
    encryptedSigner,
    currFid,
    isConnected,
    openFarcasterQR,
    getChannelFromId,
  } = useFarcasterCtx();

  const creatorData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData: {},
    farcasterUserDataObj,
  });

  const quoteCast = useCallback(
    async (data: {
      castBody: CastAddBody;
      channel: Channelv1;
      toChannels: string[];
    }) => {
      if (!encryptedSigner) return;

      const tcs = (data.toChannels || [])
        .map((channelId) => {
          return getChannelFromId(channelId);
        })
        .filter((item) => item !== null);

      try {
        if (tcs.length === 0) {
          const cast = (
            await makeCastAdd(
              {
                text: data.castBody.text,
                embeds: [{ castId }],
                embedsDeprecated: [],
                mentions: data.castBody.mentions || [],
                mentionsPositions: data.castBody.mentionsPositions || [],
                parentUrl: data.channel.parent_url || undefined,
              },
              { fid: currFid, network: FARCASTER_NETWORK },
              encryptedSigner
            )
          )._unsafeUnwrap();
          const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
          if (result.isErr()) {
            throw new Error(result.error.message);
          }
        } else {
          const result = await Promise.all(
            tcs.map(async (toChannel) => {
              const cast = (
                await makeCastAdd(
                  {
                    text: data.castBody.text,
                    embeds: [{ castId }],
                    embedsDeprecated: [],
                    mentions: data.castBody.mentions || [],
                    mentionsPositions: data.castBody.mentionsPositions || [],
                    parentUrl: toChannel.parent_url,
                  },
                  { fid: currFid, network: FARCASTER_NETWORK },
                  encryptedSigner
                )
              )._unsafeUnwrap();
              const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
              return result;
            })
          );
          result.forEach((r) => {
            if (r.isErr()) {
              throw new Error(r.error.message);
            }
          });
        }
        toast.success('post created');
      } catch (error) {
        console.error(error);
        toast.error('error creating post');
      } finally {
        setOpen(false);
      }
    },
    [encryptedSigner, currFid, castId, creatorData]
  );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-2 text-xs text-[#718096] hover:text-[#00b171] hover:cursor-pointer',
              reposted && 'text-[#00b171]'
            )}
          >
            <LoopIcon className="w-3 h-3" />
            <span>{repostCount}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-fit bg-black text-white p-3 border-none">
          <DropdownMenuGroup className="flex flex-col gap-2">
            <DropdownMenuItem
              className="gap-2 focus:bg-inherit focus:text-white hover:bg-inherit hover:cursor-pointer"
              onClick={repostAction}
            >
              <LoopIcon className="w-3 h-3" />
              <span>Repost</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 focus:bg-inherit focus:text-white hover:bg-inherit hover:cursor-pointer"
              onClick={() => {
                if (!isConnected) {
                  openFarcasterQR();
                  return;
                }
                setOpen(true);
              }}
            >
              <Pencil2Icon className="w-3 h-3" />
              <span>Quote</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalContainer
        open={open}
        closeModal={() => {
          setOpen(false);
        }}
        zIndex={50}
        contentTop="40%"
        className="w-full md:w-[600px]"
      >
        <div className="flex flex-col gap-5 p-5 bg-[#1B1E23] text-white border-[#39424C] rounded-xl md:rounded-[20px] md:max-w-none md:w-[600px]">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Quote Post</span>
            <div
              className="p-1 hover:cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Cross2Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <FCastTitle
              cast={cast}
              farcasterUserDataObj={farcasterUserDataObj}
            />
            <FCastText
              cast={cast}
              farcasterUserDataObj={farcasterUserDataObj}
            />
          </div>
          <div>
            <QuoteCast quoteCast={quoteCast} />
          </div>
        </div>
      </ModalContainer>
    </div>
  );
}

function QuoteCast({
  quoteCast,
}: {
  quoteCast: ({
    castBody,
    channel,
    toChannels,
  }: {
    castBody: CastAddBody;
    channel: Channelv1;
    toChannels: string[];
  }) => void;
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
  const [, setFarcasterInputText] = useState('');
  const handleSubmitToFarcaster = useCallback(
    (castBody: CastAddBody, toChannels: string[]) => {
      console.log(castBody, channelSelected);
      quoteCast({ castBody, channel: channelSelected, toChannels });
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
          />
          <div className="flex-grow" />
          <Button
            className="h-10 rounded-[10px] text-black text-[16px] bg-gradient-to-r from-[#cd62ff] to-[#62aaff]"
            onClick={() => {
              if (!isLoginU3) {
                loginU3();
                return;
              }
              farcasterInputRef.current?.handleFarcasterSubmit();
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
