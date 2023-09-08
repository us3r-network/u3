import { useState } from 'react';
import styled from 'styled-components';
import AddPostModal from './AddPostModal';
import ButtonBase from '../common/button/ButtonBase';
import useLogin from '../../hooks/useLogin';

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

const AddButton = styled(ButtonBase)`
  display: flex;
  width: 100%;
  height: 60px;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 20px;
  background: linear-gradient(87deg, #cd62ff 0%, #62aaff 100%);

  color: #000;

  /* medium-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
