import { useState } from 'react';
import styled from 'styled-components';
import AddPostModal from './AddPostModal';
import useLogin from '../../hooks/shared/useLogin';
import { SocialButtonPrimary } from './button/SocialButton';

export default function AddPostMobile() {
  const [open, setOpen] = useState(false);
  const { isLogin, login } = useLogin();
  return (
    <>
      <AddButton
        onClick={() => {
          if (!isLogin) {
            login();
            return;
          }
          setOpen(true);
        }}
      >
        +
      </AddButton>
      <AddPostModal
        open={open}
        closeModal={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

const AddButton = styled(SocialButtonPrimary)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  color: #fff;
  font-size: 36px;
  font-weight: 700;
`;
