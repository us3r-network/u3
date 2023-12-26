import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export function CurrentUserInfoAvatar() {
  const { currUserInfoObj } = useFarcasterCtx();
  return (
    <Avatar className="w-10 h-10">
      <AvatarImage src={currUserInfoObj.pfp} className="object-cover" />
      <AvatarFallback>{currUserInfoObj.userName}</AvatarFallback>
    </Avatar>
  );
}
