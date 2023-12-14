import dayjs from 'dayjs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import { FarCast } from '@/services/social/types';
import { UserData } from '@/utils/social/farcaster/user-data';

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
