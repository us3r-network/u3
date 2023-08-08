import styled, { css, StyledComponentPropsWithRef } from 'styled-components'

export type ButtonProps = StyledComponentPropsWithRef<'button'>

function ButtonBase({ children, ...otherProps }: ButtonProps) {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>
}
export default ButtonBase

export const ButtonBaseCss = css`
  height: 48px;
  padding: 12px 24px;
  box-sizing: border-box;
  border-radius: 12px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: none;
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
`
export const ButtonPrimaryCss = css`
  ${ButtonBaseCss}
  background-color: #ffffff;
  color: #14171a;
`
export const ButtonPrimary = styled.button`
  ${ButtonPrimaryCss}
`

export const ButtonPrimaryLineCss = css`
  ${ButtonBaseCss}
  border: 1px solid #39424c;
  background-color: #1a1e23;
  color: #718096;
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
    background-color: #14171a;
  }
  &:not(:disabled):hover {
    border: 1px solid #aaa;
    background-color: #14171a;
  }
`
export const ButtonPrimaryLine = styled.button`
  ${ButtonPrimaryLineCss}
`
export const ButtonWarning = styled(ButtonBaseWrapper)`
  background-color: #ebb700;
`
export const ButtonDanger = styled(ButtonBaseWrapper)`
  background-color: #d60606;
`
export const ButtonInfo = styled(ButtonBaseWrapper)`
  background-color: #ebeee4;
  color: #333333;
`
