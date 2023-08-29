import { useState } from 'react'
import AddPostModal from './Modal/AddPostModal'
import ButtonBase from './common/button/ButtonBase'
import styled from 'styled-components'

export default function AddPost() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <AddButton
        onClick={() => {
          setOpen(true)
        }}
      >
        Post
      </AddButton>
      <AddPostModal
        open={open}
        closeModal={() => {
          setOpen(false)
        }}
      />
    </div>
  )
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
`
