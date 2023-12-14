import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import FarcasterIcon from '@/components/common/icons/FarcasterIcon';

export default function FCastPost({
  postAction,
}: {
  postAction: (text: string) => void;
}) {
  const { currUserInfoObj } = useFarcasterCtx();

  const [text, setText] = useState('');
  return (
    <div className="flex items-center flex-grow gap-2">
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={currUserInfoObj.pfp} className="object-cover" />
          <AvatarFallback>{currUserInfoObj.userName}</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0">
          <FarcasterIcon />
        </div>
      </div>
      <div className="flex items-center flex-grow bg-[#14171A] border-none p-[10px] h-10 rounded-[10px]">
        <input
          type="text"
          className="flex-grow bg-inherit border-none outline-none"
          placeholder="Create a post..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
      <Button
        className="h-10 p-3 rounded-[10px] text-black font-bold text-[16px] bg-gradient-to-r from-[#cd62ff] to-[#62aaff]"
        onClick={() => {
          postAction(text);
        }}
      >
        Post
      </Button>
    </div>
  );
}
