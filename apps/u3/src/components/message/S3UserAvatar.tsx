import { UserAvatar, UserAvatarProps } from '@us3r-network/profile';
import styled from 'styled-components';

export default function S3UserAvatar(props: UserAvatarProps) {
  return <UserAvatarStyled {...props} />;
}
const UserAvatarStyled = styled(UserAvatar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  svg {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
  }
`;
