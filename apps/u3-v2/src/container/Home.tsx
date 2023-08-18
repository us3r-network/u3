import styled from 'styled-components'

import useLoadFarcasterFeeds from '../hooks/useLoadFarcasterFeeds'
import FCast from '../components/FCast'
import AddPost from '../components/AddPost'
import { useMemo, useState } from 'react'
import FarcasterQRModal from '../components/Modal/FarcasterQRModal'
import { useFarcasterCtx } from '../contexts/farcaster'

export default function Home() {
  const [openQR, setOpenQR] = useState(false)
  const { farcasterFeeds, loadMoreFarcasterFeeds } = useLoadFarcasterFeeds()
  const { isConnected, token } = useFarcasterCtx()

  const openFarcasterQR = () => setOpenQR(true)

  const openQRModal = useMemo(() => {
    if (isConnected) {
      return false
    }
    return openQR
  }, [isConnected, openQR])

  return (
    <HomeWrapper>
      <div>
        <AddPost openFarcasterQR={openFarcasterQR} />
      </div>

      {farcasterFeeds && (
        <div className="feeds-list">
          {farcasterFeeds.map(({ data: cast, platform }) => {
            if (platform === 'farcaster') {
              return (
                <FCast
                  key={Buffer.from(cast.hash.data).toString('hex')}
                  cast={cast}
                  openFarcasterQR={openFarcasterQR}
                />
              )
            }
            return null
          })}
          <button onClick={loadMoreFarcasterFeeds}>loadMore</button>
        </div>
      )}
      <FarcasterQRModal
        open={openQRModal}
        closeModal={() => {
          setOpenQR(false)
        }}
      />
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;

  .feeds-list {
    display: flex;
    flex-direction: column;
  }
`
