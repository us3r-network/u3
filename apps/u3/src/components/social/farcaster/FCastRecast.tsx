/* eslint-disable @typescript-eslint/no-shadow */
import {
  CastId,
  ReactionType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { LoopIcon, Pencil2Icon } from '@radix-ui/react-icons';

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

export default function FCastRecast({
  cast,
  openFarcasterQR,
}: {
  cast: FarCast;
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
      quoteAction={() => {
        alert('todo');
      }}
    />
  );
}

function Repost({
  reposted,
  repostCount,
  repostAction,
  quoteAction,
}: {
  reposted: boolean;
  repostCount: number;
  repostAction: () => void;
  quoteAction: () => void;
}) {
  return (
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
            onClick={quoteAction}
          >
            <Pencil2Icon className="w-3 h-3" />
            <span>Quote</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
