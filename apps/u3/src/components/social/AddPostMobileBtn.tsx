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
        className="h-[36px] px-[12px] py-[0px]"
        onClick={() => {
          if (!isLogin) {
            login();
            return;
          }
          setOpen(true);
        }}
      >
        Post
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
