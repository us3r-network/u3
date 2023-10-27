import styled, { StyledComponentPropsWithRef } from 'styled-components';
import EditSvg from '../../common/assets/svgs/edit.svg';

interface ProfileAvatarProps extends StyledComponentPropsWithRef<'div'> {
  src: string;
  isLoginUser?: boolean;
}
export default function ProfileAvatar({
  src,
  isLoginUser,
  ...wrapperProps
}: ProfileAvatarProps) {
  return (
    <ProfileAvatarWrapper isLoginUser={isLoginUser} {...wrapperProps}>
      <Img src={src} />
    </ProfileAvatarWrapper>
  );
}

const ProfileAvatarWrapper = styled.div<{ isLoginUser?: boolean }>`
  display: inline-block;
  position: relative;
  width: 80px !important;
  height: 80px !important;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url(${EditSvg});
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  ${(props) =>
    !props?.isLoginUser &&
    `
    cursor: default;
    &:hover {
      &::after {
        content: none;
      }
    }
  `}
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: relative;
  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: inherit;
    background: linear-gradient(to right, #cd62ff 35.31%, #62aaff 89.64%);
  }
`;
