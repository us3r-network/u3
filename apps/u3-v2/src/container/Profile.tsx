import NoLogin from '../components/NoLogin'
import styled from 'styled-components'
import UserInfo from '../components/profile/UserInfo'
import { useAccount } from 'wagmi'
import { useParams } from 'react-router-dom'
import { fetchQuery } from '@airstack/airstack-react'
import { useEffect, useState } from 'react'
import { DomainQuery } from '../api/airstack'
import UserAssets from '../components/profile/UserAssets'

export default function Profile() {
  const { address } = useAccount()
  const { addr } = useParams()
  const [ensAddr, setEnsAddr] = useState('')
  const [resolving, setResolving] = useState(true)

  const resolveENS = async (addr: string) => {
    try {
      const { data, error } = await fetchQuery(
        DomainQuery,
        {
          name: addr,
        },
        { cache: true },
      )
      if (error) {
        throw error
      }
      setEnsAddr(data?.Domain?.owner || '')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (addr?.endsWith('.eth')) {
      resolveENS(addr).finally(() => {
        setResolving(false)
      })
      return
    }
    if (addr) {
      setEnsAddr(addr)
    }
    setResolving(false)
  }, [addr])

  const walletAddr = ensAddr || address

  console.log({ walletAddr })

  if (resolving) {
    return <div>Resolving...</div>
  }

  if (!walletAddr) {
    return <NoLogin />
  }
  return (
    <ProfileWrapper>
      <ProfileInfo addr={walletAddr} />
    </ProfileWrapper>
  )
}

function ProfileInfo({ addr }: { addr: string }) {
  const [zoomIn, setZoomIn] = useState(false)
  return (
    <ProfileInfoWrapper>
      <UserInfo />
      <UserDataBox>
        <div className="posts">
          coming soon
          {!zoomIn && (
            <button
              onClick={() => {
                setZoomIn(true)
              }}
            >
              zoomOut
            </button>
          )}
        </div>
        <UserAssets
          addrs={[addr]}
          zoomIn={zoomIn}
          zoomOut={() => {
            setZoomIn(false)
          }}
        />
      </UserDataBox>
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

const UserDataBox = styled.div`
  display: flex;
  gap: 20px;

  > .posts {
    flex-grow: 1;
  }
`
