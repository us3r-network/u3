import styled, { css, StyledComponentPropsWithRef } from 'styled-components'

export type ButtonProps = StyledComponentPropsWithRef<'button'>

function ButtonBase({ children, ...otherProps }: ButtonProps) {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>
}
export default ButtonBase

export const ButtonBaseCss = css`
  height: 40px;
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
  background-color: #D6F16C;
  color: #000;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
export const ButtonPrimary = styled.button`
  ${ButtonPrimaryCss}
`

export const ButtonPrimaryLineCss = css`
  ${ButtonPrimaryCss}
  background: none;
  color: #fff;

  border: 1px solid #d6f16c;
  color: #d6f16c;
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
    background-color: none;
  }
  &:not(:disabled):hover {
    background-color: #d6f16c;
    color: #14171a;
    border: 1px solid #d6f16c;
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
