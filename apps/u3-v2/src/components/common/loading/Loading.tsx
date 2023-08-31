import styled, { StyledComponentPropsWithRef } from 'styled-components'
import LoadingSvg from './loading.svg'

export default function Loading(props: StyledComponentPropsWithRef<'img'>) {
  return <LoadingWrapper src={LoadingSvg} alt="loading" {...props} />
}
const LoadingWrapper = styled.img`
  width: 60px;
  height: 60px;
`
