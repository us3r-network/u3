import { useSession } from '@us3r-network/auth-with-rainbowkit'
import { LoginButton, LogoutButton, UserAvatar } from '@us3r-network/profile'
import { NavLink, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import SearchInput from './common/input/SearchInput'
import HomeIcon from './common/icons/HomeIcon'
import HomeActiveIcon from './common/icons/HomeActiveIcon'
import MessageMenu from './message/MessageMenu'
import MessageModal from './message/MessageModal'
import AddPost from './AddPost'
import { useCallback } from 'react'
import UserMenu from './UserMenu'

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams()
  const onSearch = useCallback(
    (value: string) => {
      setSearchParams(new URLSearchParams({ ...searchParams, keyword: value }))
    },
    [searchParams, setSearchParams],
  )
  return (
    <NavContainer>
      <Main>
        <Left>
          <NavLinkItem to="/">
            {({ isActive }) =>
              isActive ? (
                <HomeActiveIcon className="nav-icon" />
              ) : (
                <HomeIcon className="nav-icon" />
              )
            }
          </NavLinkItem>
        </Left>
        <Center>
          <Search placeholder="Search" onSearch={onSearch} />
          <AddPost />
        </Center>
        <Right>
          <MessageMenu />
          <UserMenu />
        </Right>
        <MessageModal />
      </Main>
    </NavContainer>
  )
}

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  background: #212228;
  box-sizing: border-box;
  display: flex;
  z-index: 50;
`
const Main = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`
const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const NavLinkItem = styled(NavLink)`
  > .nav-icon {
    width: 30px;
    height: 30px;
  }
`

const Search = styled(SearchInput)`
  width: 375px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #2b2c31;
`
