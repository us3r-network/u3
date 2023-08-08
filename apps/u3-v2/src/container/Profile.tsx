import { useSession } from '@us3r-network/auth-with-rainbowkit'
import NoLogin from '../components/NoLogin'
import styled from 'styled-components'
import UserInfo from '../components/profile/UserInfo'
import UserWallets from '../components/profile/UserWallets'
import UserTags from '../components/profile/UserTags'

export default function Profile() {
  const session = useSession()
  if (!session) {
    return <NoLogin />
  }
  return (
    <ProfileWrapper>
      <ProfileInfo />
    </ProfileWrapper>
  )
}

function ProfileInfo() {
  return (
    <ProfileInfoWrapper>
      <UserInfo />
      <UserWallets />
      <UserTags />
    </ProfileInfoWrapper>
  )
}

const ProfileWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
`

const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
