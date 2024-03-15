import { useState } from 'react';
import AddPostModal from './AddPostModal';
import useLogin from '../../hooks/shared/useLogin';
import ColorButton from '../common/button/ColorButton';

export default function AddPostMobileBtn() {
  const [open, setOpen] = useState(false);
  const { isLogin, login } = useLogin();
  return (
    <>
      <ColorButton
        className="w-[60px] h-[60px] max-sm:w-[60px] max-sm:h-[60px] rounded-full p-[0px] fixed right-[10px] bottom-[90px] text-[64px] font-normal"
        onClick={() => {
          if (!isLogin) {
            login();
            return;
          }
          setOpen(true);
        }}
      >
        +
      </ColorButton>
      <AddPostModal
        open={open}
        closeModal={() => {
          setOpen(false);
        }}
      />
    </>
  );
}
