import dayjs from 'dayjs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import { FarCast } from '@/services/social/types';
import { UserData } from '@/utils/social/farcaster/user-data';
import FarcasterIcon from '@/components/common/icons/FarcasterIcon';

export default function FCastTitle({
  cast,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
}) {
  const userData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData: {},
    farcasterUserDataObj,
  });
  return (
    <div className="flex gap-2 items-center">
      <Avatar className="w-5 h-5">
        <AvatarImage src={userData.pfp} className="object-cover" />
        <AvatarFallback>{userData.userName}</AvatarFallback>
      </Avatar>
      <span className="text-white font-bold">{userData.display}</span>
      <span className="text-[#718096]">
        {`@${userData.userName}`} · {dayjs(cast.createdAt).fromNow()}
      </span>
    </div>
  );
}

export function FcastTitle2({
  cast,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
}) {
  const userData = useFarcasterUserData({
    fid: cast.fid,
    farcasterUserData: {},
    farcasterUserDataObj,
  });
  return (
    <div className="flex gap-2 items-center">
      <Avatar className="w-10 h-10">
        <AvatarImage src={userData.pfp} className="object-cover" />
        <AvatarFallback>{userData.userName}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-bold">
            {userData.display}
          </span>
          <span className="">
            <FarcasterIcon />
          </span>
        </div>
        <div>
          <span className="text-[#718096]">
            {`@${userData.userName || userData.fid}`} ·{' '}
            {dayjs(cast.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
}
