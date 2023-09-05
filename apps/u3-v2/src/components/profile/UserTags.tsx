import { UserTags, UserTagAddForm } from '@us3r-network/profile'
import styled from 'styled-components'
import { useState } from 'react'
import { Dialog, Heading, Modal } from 'react-aria-components'
import { InputBaseCss } from '../common/input/InputBase'
import { ButtonPrimaryLineCss } from '../common/button/ButtonBase'
import AddIcon from '../icons/AddIcon'

export default function UserTagsStyled () {
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  return (
    <UserTagsWrapper>
      <div className='header'>
        <h3>
          Tags (<UserTags.Count />)
        </h3>
        <span
          onClick={() => {
            setIsOpenEdit(true)
          }}
        >
          <AddIcon />
        </span>
      </div>
      <UserTags.List>
        {item => <UserTags.Item key={item.tag} value={item} />}
      </UserTags.List>
      <Modal isDismissable isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <Dialog>
          <Heading>Add New Tag</Heading>
          <UserTagAddFormWrapper
            onSuccessfullySubmit={() => {
              setIsOpenEdit(false)
            }}
          >
            <UserTagAddForm.TagInput />

            <UserTagAddForm.SubmitButton>Save</UserTagAddForm.SubmitButton>

            <UserTagAddForm.ErrorMessage />
          </UserTagAddFormWrapper>
        </Dialog>
      </Modal>
    </UserTagsWrapper>
  )
}
const UserTagsWrapper = styled(UserTags)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 20px;
  width: 360px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > h3 {
      margin: 0;
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      color: #ffffff;
    }

    > span {
      cursor: pointer;
    }
  }

  [data-state-element='List'] {
    width: 100%;
    margin-top: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  [data-state-element='Item'] {
    padding: 10px 20px;
    background: #1a1e23;
    border: 1px solid #39424c;
    border-radius: 12px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    box-sizing: border-box;
    height: 36px;
    color: #718096;
    &[data-focused] {
      outline: none;
    }
  }
`

const UserTagAddFormWrapper = styled(UserTagAddForm)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 380px;
  [data-state-element='TagInput'] {
    ${InputBaseCss}
  }
  [data-state-element='SubmitButton'] {
    ${ButtonPrimaryLineCss}
  }
  [data-state-element='ErrorMessage'] {
    color: red;
  }
`
