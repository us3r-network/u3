import { useState } from 'react';
import styled from 'styled-components';
import AddPostModal from './AddPostModal';
import useLogin from '../../hooks/useLogin';
import { SocialButtonPrimary } from './button/SocialButton';

export default function AddPost() {
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
        Post
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
  width: 100%;
  height: 60px;
  border-radius: 20px;
  color: #000;

  /* medium-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
