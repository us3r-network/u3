import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { cn } from '@/lib/utils';
import AddPostModal from './AddPostModal';
import useLogin from '../../hooks/shared/useLogin';
import CommandIcon from '../common/icons/CommandIcon';
import { Button } from '../ui/button';

export default function AddPost() {
  const [open, setOpen] = useState(false);
  const { isLogin, login } = useLogin();

  useHotkeys(
    'meta+p',
    (e) => {
      e.preventDefault();
      if (!isLogin) {
        login();
        return;
      }
      setOpen(true);
    },
    [isLogin]
  );

  return (
    <>
      <Button
        className={cn(
          'flex items-center gap-2 text-black text-[16px]',
          'bg-gradient-to-r from-[#cd62ff] to-[#62aaff]',
          'h-[60px] p-[16px] rounded-[20px] gap-[8px] box-border'
        )}
        onClick={() => {
          if (!isLogin) {
            login();
            return;
          }
          setOpen(true);
        }}
      >
        <CommandIcon />
        <span>Command + P to Post</span>
      </Button>
      <AddPostModal
        open={open}
        closeModal={() => {
          setOpen(false);
        }}
      />
    </>
  );
}
