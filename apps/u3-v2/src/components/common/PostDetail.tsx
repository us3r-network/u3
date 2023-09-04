import styled from 'styled-components'
import ButtonBase from './button/ButtonBase'

export const PostDetailWrapper = styled.div`
  border-radius: 20px;
  background: #212228;
  overflow: hidden;
`
export const PostDetailCommentsWrapper = styled.div`
  & > *:not(:first-child) {
    border-top: 1px solid #191a1f;
  }
`

export const LoadMoreBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background: #212228;
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
