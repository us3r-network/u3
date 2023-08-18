import { useState } from 'react'
import styled from 'styled-components'
import InputBase from '../common/input/InputBase'
import { ButtonPrimaryLine } from '../common/button/ButtonBase'
import { useCreateLensPost } from '../../hooks/lens/useCreateLensPost'
import { useLensAuth } from '../../contexts/AppLensCtx'

export default function LensPostCreate() {
  const { isLogin, lensLogin } = useLensAuth()
  const { createText, isPending } = useCreateLensPost()
  const [text, setText] = useState('')
  return (
    <LensPostCreateWrapper>
      <Header>Publish Post</Header>
      <CreateForm>
        <CreateInput
          disabled={isPending}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <SubmitButton
          disabled={isPending}
          onClick={async () => {
            if (!isLogin) {
              lensLogin()
              return
            }
            await createText(text)
            alert('Created successfully, please refresh the list.')
            setText('')
          }}
        >
          {isPending ? 'Loading...' : '+ Post'}
        </SubmitButton>
      </CreateForm>
    </LensPostCreateWrapper>
  )
}
const LensPostCreateWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
`
const Header = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
`
const CreateForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const CreateInput = styled(InputBase)``
const SubmitButton = styled(ButtonPrimaryLine)`
  width: 100%;
`
