/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-08 16:44:26
 * @Description: file description
 */
// import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { UserAvatar, UserName } from '@us3r-network/profile';
import useLogin from '../../hooks/shared/useLogin';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import LogoutSvg from '../common/assets/svgs/logout.svg';

type Props = {
  onlyIcon?: boolean;
  onLogout?: () => void;
};
export default function LoginButton({ onlyIcon, onLogout }: Props) {
  const { user, isLogin, login } = useLogin();
  const navigate = useNavigate();

  return (
    <LoginButtonWrapper>
      {isLogin ? (
        <LoginUser
          onClick={() => {
            navigate('/u');
          }}
          onlyIcon={onlyIcon}
        >
          <UserAvatar />
          <UserName />
        </LoginUser>
      ) : (
        <Button onClick={login} onlyIcon={onlyIcon}>
          <NoLoginText className="wl-user-button_no-login-text">
            Login
          </NoLoginText>
        </Button>
      )}
    </LoginButtonWrapper>
  );
}

export function LogoutButton({
  onlyIcon,
  ...otherProps
}: StyledComponentPropsWithRef<'button'> & {
  onlyIcon?: boolean;
}) {
  return (
    <Button onlyIcon={onlyIcon} {...otherProps}>
      {!onlyIcon && `Logout`}
      <LogoutIconButton src={LogoutSvg} />
    </Button>
  );
}

const LoginButtonWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Button = styled(ButtonPrimaryLine)<{ onlyIcon?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  isolation: isolate;
  transition: all 0.3s ease-out;
  ${({ onlyIcon }) =>
    onlyIcon &&
    `
    padding: 0;
    border: none;
  `}
`;
const LoginUser = styled(Button)<{ onlyIcon?: boolean }>`
  gap: 0;
  [data-us3r-component='UserAvatar'] {
    width: 30px;
    height: 30px;
  }
  [data-us3r-component='UserName'] {
    flex: 1;
    font-weight: 400;
    line-height: 17px;

    color: #718096;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ${({ onlyIcon }) =>
    onlyIcon &&
    `
    [data-us3r-component='UserAvatar'] {
      width: 40px;
      height: 40px;
    }
    [data-us3r-component="UserName"] {
      flex: 0;
      width: 0;
    }
  `}
`;
const LogoutIconButton = styled.img`
  width: 24px;
  height: 24px;
`;

const NoLoginText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
