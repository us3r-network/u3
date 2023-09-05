import styled, { StyledComponentPropsWithRef } from 'styled-components'
import InputBase from '../common/input/InputBase'
import { ButtonPrimary } from '../common/button/ButtonBase'

export interface ReplyFormProps {
  avatar: string
  content: string
  setContent: (content: string) => void
  disabled?: boolean
  submitting?: boolean
  onSubmit?: () => void
}
export default function ReplyForm ({
  avatar,
  content,
  setContent,
  disabled,
  submitting,
  onSubmit,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & ReplyFormProps) {
  return (
    <ReplyFormWrapper {...wrapperProps}>
      <Avatar src={avatar} />
      <Input
        disabled={disabled || submitting}
        onChange={e => {
          setContent(e.target.value)
        }}
      />
      <SubmitBtn disabled={disabled || submitting} onClick={onSubmit}>
        {submitting ? 'Replying' : 'Reply'}
      </SubmitBtn>
    </ReplyFormWrapper>
  )
}

const ReplyFormWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  background: #2b2c31;
  padding: 20px;
  box-sizing: border-box;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
`

const Input = styled(InputBase)`
  border: none;
  background: none;
`

const SubmitBtn = styled(ButtonPrimary)``
