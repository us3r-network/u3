import { cn } from '@/lib/utils';
// import AddPostModal from './AddPostModal';
import useLogin from '../../hooks/shared/useLogin';
import CommandIcon from '../common/icons/CommandIcon';
import ColorButton from '../common/button/ColorButton';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function AddPost() {
  const { isLogin, login } = useLogin();
  const { openPostModal, setOpenPostModal } = useFarcasterCtx();

  return (
    <ColorButton
      className={cn(
        'flex items-center gap-2 text-black text-[16px]',
        'h-[60px] p-[16px] rounded-[20px] gap-[8px] box-border'
      )}
      onClick={() => {
        if (!isLogin) {
          login();
          return;
        }
        setOpenPostModal(true);
      }}
    >
      <CommandIcon />
      <span>Command + P to Post</span>
    </ColorButton>
  );
}
