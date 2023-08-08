import { useSession } from '@us3r-network/auth-with-rainbowkit'
import { LoginButton, LogoutButton, UserAvatar } from '@us3r-network/profile'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export default function Nav() {
  const session = useSession()
  return (
    <NavContainer>
      <NavLinks>
        <NavLinkItem to="/profile">Profile</NavLinkItem>
        <NavLinkItem to="/">Social</NavLinkItem>
      </NavLinks>
      <NavFooter>
        {!!session ? (
          <>
            <UserAvatar />
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </NavFooter>
    </NavContainer>
  )
}

const NavContainer = styled.nav`
  width: 70px;
  height: 100vh;
  border-right: 1px solid #e5e5e5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const NavLinks = styled.div`
  height: 0;
  flex: 1;
  overflow-y: auto;
`

const NavLinkItem = styled(NavLink)`
  display: block;
  width: 100%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  text-decoration: none;
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  &:hover {
    background: #f5f5f5;
  }
  &.active {
    background: #f5f5f5;
  }
`

const NavFooter = styled.div`
  padding: 20px 0px;
  box-sizing: border-box;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  align-items: center;
`
