import { LoginButton, LogoutButton, UserAvatar } from '@us3r-network/profile'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ButtonBaseCss } from './common/button/ButtonBase'
import { useEffect, useRef, useState } from 'react'
import ExpandArrowIcon from './common/icons/ExpandArrowIcon'
import LogoutIcon from './common/icons/LogoutIcon'
import ProfileIcon from './common/icons/ProfileIcon'
import { useSession } from '@us3r-network/auth-with-rainbowkit'

export default function UserMenu() {
  const session = useSession()
  if (session) {
    return <UserMenuBtn />
  }
  return <LoginBtn />
}

function UserMenuBtn() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserMenuBtnWrapper
      onClick={(e) => {
        e.stopPropagation()
        setOpen(!open)
      }}
    >
      <UserAvatar className="user-avatar" />
      <ExpandArrowIconStyled open={open} />
      {open && (
        <UserMenuDropdownWrapper ref={dropdownRef}>
          <DropdownLinkOption to="/profile">
            <ProfileIcon className="icon" />
            <span className="text">Portfolio</span>
          </DropdownLinkOption>

          <DropdownLogoutOption>
            <LogoutIcon className="icon" />
            <span className="text">Logout</span>
          </DropdownLogoutOption>
        </UserMenuDropdownWrapper>
      )}
    </UserMenuBtnWrapper>
  )
}

const UserMenuBtnCss = css`
  ${ButtonBaseCss}
  height: 40px;
  padding: 10px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  background: #2b2c31;
  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
`

const LoginBtn = styled(LoginButton)`
  &[data-focused] {
    outline: none;
  }
  ${UserMenuBtnCss}
`

const UserMenuBtnWrapper = styled.button`
  ${UserMenuBtnCss}

  position: relative;

  .user-avatar {
    width: 20px;
    height: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
`

const UserMenuDropdownWrapper = styled.div`
  border-radius: 10px;
  background: #282828;

  position: absolute;
  top: 50px;
  right: 0;
`

const DropdownOptionCss = css`
  min-width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 23px;
  cursor: pointer;
  .icon {
    width: 12px;
    height: 12px;
  }
  .text {
    color: #fff;
    font-family: Baloo Bhai 2;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`
const DropdownLinkOption = styled(NavLink)`
  ${DropdownOptionCss}
`
const DropdownLogoutOption = styled(LogoutButton)`
  &[data-focused] {
    outline: none;
  }
  background: none;
  border: none;
  ${DropdownOptionCss}
`

const ExpandArrowIconStyled = styled(ExpandArrowIcon)<{ open: boolean }>`
  width: 20px;
  height: 20px;
  transform: rotate(${(props) => (props.open ? '180deg' : '0deg')});
`
