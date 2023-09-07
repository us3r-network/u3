import { useState } from 'react';
import styled from 'styled-components';
import AddPostModal from './AddPostModal';
import ButtonBase from '../common/button/ButtonBase';
import useLogin from '../../hooks/useLogin';

export default function AddPost() {
  const [open, setOpen] = useState(false);
  const { isLogin, login } = useLogin();
  return (
    <div>
      <AddButton
        onClick={async () => {
          if (!isLogin) {
            await login();
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
    </div>
  );
}

const AddButton = styled(ButtonBase)`
  width: 60px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #d6f16c;

  color: #000;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
