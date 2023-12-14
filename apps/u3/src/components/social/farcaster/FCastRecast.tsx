/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
import {
  CastId,
  ReactionType,
  makeCastAdd,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web';
import { useCallback, useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserData } from '@/utils/social/farcaster/user-data';
import FCastText from './FCastText';
import FCastTitle from './FCastTitle';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import FCastPost from './FCastPost';

export default function FCastRecast({
  cast,
  openFarcasterQR,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
  openFarcasterQR: () => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { encryptedSigner, isConnected, currFid } = useFarcasterCtx();
  const [recasts, setRecasts] = useState<string[]>(
    Array.from(new Set(cast.recasts))
  );
  const [recastCount, setRecastCount] = useState<number>(
    Number(cast.recast_count || cast.recastsCount || 0)
  );

  const recast = useCallback(
    async (castId: CastId) => {
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      try {
        const cast = await makeReactionAdd(
          {
            type: ReactionType.RECAST,
            targetCastId: castId,
          },
          {
            fid: currFid,
            network: FARCASTER_NETWORK,
          },
          encryptedSigner
        );
        if (cast.isErr()) {
          throw new Error(cast.error.message);
        }

        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast.value);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const tmpSet = new Set(recasts);
        tmpSet.add(`${currFid}`);
        setRecasts(Array.from(tmpSet));
        setRecastCount(recastCount + 1);

        toast.success('recast created');
      } catch (error) {
        toast.error('error recast');
      }
    },
    [
      encryptedSigner,
      isConnected,
      openFarcasterQR,
      recastCount,
      recasts,
      currFid,
    ]
  );

  const removeRecast = useCallback(
    async (castId: CastId) => {
      if (!currFid) return;
      if (!isConnected) {
        openFarcasterQR();
        return;
      }
      if (!encryptedSigner) return;
      // const currFid = getCurrFid();
      try {
        const cast = await makeReactionRemove(
          {
            type: ReactionType.RECAST,
            targetCastId: castId,
          },
          {
            fid: currFid,
            network: FARCASTER_NETWORK,
          },
          encryptedSigner
        );
        if (cast.isErr()) {
          throw new Error(cast.error.message);
        }

        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast.value);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const tmpSet = new Set(recasts);
        tmpSet.delete(`${currFid}`);
        setRecasts(Array.from(tmpSet));
        setRecastCount(recastCount - 1);

        toast.success('removed recast');
      } catch (error) {
        toast.error('error recast');
      }
    },
    [
      encryptedSigner,
      isConnected,
      openFarcasterQR,
      recastCount,
      recasts,
      currFid,
    ]
  );

  // const currFid: string = useFarcasterCurrFid();
  const castId: CastId = useFarcasterCastId({ cast });

  return (
    <Repost
      cast={cast}
      farcasterUserDataObj={farcasterUserDataObj}
      reposted={recasts.includes(`${currFid}`)}
      repostCount={recastCount}
      repostAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (recasts.includes(`${currFid}`)) {
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
  const { encryptedSigner, currFid } = useFarcasterCtx();
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();

  const creatorData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData: {},
    farcasterUserDataObj,
  });

  const quoteCast = useCallback(
    async (text: string) => {
      if (!encryptedSigner) return;
      const url = `https://warpcast.com/${creatorData.userName}/0x${Buffer.from(
        castId.hash
      )
        .toString('hex')
        .substring(0, 8)}`;

      try {
        const cast = (
          await makeCastAdd(
            {
              text,
              embeds: [{ url }],
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
    <AlertDialog open={open} onOpenChange={setOpen}>
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
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="gap-2 focus:bg-inherit focus:text-white hover:bg-inherit hover:cursor-pointer">
                <Pencil2Icon className="w-3 h-3" />
                <span>Quote</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="flex flex-col gap-5 bg-[#1B1E23] text-white border-[#39424C] rounded-xl md:rounded-[20px] md:max-w-none md:w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between ">
            <span>Quote Post</span>
            <div
              className="p-1 hover:cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Cross2Icon className="h-5 w-5" />
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-3 text-sm">
          <FCastTitle cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
          <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
        </div>
        <AlertDialogFooter className="flex-col sm:justify-start">
          <FCastPost
            postAction={(text) => {
              if (!isLoginU3) {
                loginU3();
                return;
              }
              quoteCast(text);
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
