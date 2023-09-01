import { UserAvatar, UserAvatarProps } from '@us3r-network/profile'
import styled from 'styled-components'
import Loading from '../common/loading/Loading'

export default function S3UserAvatar(props: UserAvatarProps) {
  return (
    <UserAvatarStyled {...props}>
      {({ isLoading, avatarSrc }) =>
        isLoading ? <LoadingStyled /> : <ImgStyled src={avatarSrc} />
      }
    </UserAvatarStyled>
  )
}
const UserAvatarStyled = styled(UserAvatar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
`
const LoadingStyled = styled(Loading)`
  width: 100%;
  height: 100%;
`
const ImgStyled = styled.img`
  width: 100%;
  height: 100%;
`
