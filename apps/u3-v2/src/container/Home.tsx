import styled from 'styled-components'

import { useAccount } from 'wagmi'
import useLoadFarcasterFeeds from '../hooks/useLoadFarcasterFeeds'
import FCast from '../components/FCast'
import AddPost from '../components/AddPost'

export default function Home() {
  const { address } = useAccount()

  const { farcasterFeeds, loadMoreFarcasterFeeds } = useLoadFarcasterFeeds()

  return (
    <HomeWrapper>
      <div>
        <AddPost />
      </div>
      {farcasterFeeds && (
        <div className="feeds-list">
          {farcasterFeeds.map(({ data: cast, platform }) => {
            if (platform === 'farcaster') {
              return (
                <FCast
                  key={Buffer.from(cast.hash.data).toString('hex')}
                  cast={cast}
                />
              )
            }
            return null
          })}
          <button onClick={loadMoreFarcasterFeeds}>loadMore</button>
        </div>
      )}
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
