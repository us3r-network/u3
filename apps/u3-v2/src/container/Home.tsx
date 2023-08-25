import styled from 'styled-components'
import { useEffect, useState } from 'react'
import LensPostCard from '../components/lens/LensPostCard'
import { useActiveProfile } from '@lens-protocol/react-web'
import FCast from '../components/FCast'
import { useLoadFeeds } from '../hooks/useLoadFeeds'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import AddPost from '../components/AddPost'

export default function Home() {
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile()

  const {
    firstLoading,
    moreLoading,
    feeds,
    farcasterUserData,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  } = useLoadFeeds()

  const { openFarcasterQR } = useFarcasterCtx()

  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    if (activeLensProfileLoading) return
    loadFirstFeeds({ activeLensProfileId: activeLensProfile?.id })
  }, [loadFirstFeeds, activeLensProfileLoading, activeLensProfile?.id])

  return (
    <HomeWrapper>
      <MainWrapper>
        {firstLoading ? (
          <div>Loading...</div>
        ) : (
          <PostList>
            {feeds.map(({ platform, data }) => {
              if (platform === 'lens') {
                return <LensPostCard key={data.id} data={data} />
              }
              if (platform === 'farcaster') {
                const key = Buffer.from(data.hash.data).toString('hex')
                return (
                  <FCast
                    key={key}
                    cast={data}
                    openFarcasterQR={openFarcasterQR}
                    farcasterUserData={farcasterUserData}
                  />
                )
              }
              return null
            })}
          </PostList>
        )}

        {moreLoading && <div>Loading ...</div>}

        <p>
          {!firstLoading && !moreLoading && pageInfo.hasNextPage && (
            <button
              onClick={() => {
                loadMoreFeeds({
                  keyword,
                  activeLensProfileId: activeLensProfile?.id,
                })
              }}
            >
              Load More
            </button>
          )}
        </p>
      </MainWrapper>
      <SidebarWrapper>
        <div>
          <input
            type="text"
            disabled={firstLoading || moreLoading}
            onChange={(e) => {
              setKeyword(e.target.value)
            }}
          />
          <button
            disabled={firstLoading || moreLoading}
            onClick={() => {
              loadFirstFeeds({
                keyword,
                activeLensProfileId: activeLensProfile?.id,
              })
            }}
          >
            Search
          </button>
        </div>
        <button
          onClick={() => {
            loadFirstFeeds({
              keyword,
              activeLensProfileId: activeLensProfile?.id,
            })
          }}
        >
          Refresh the list
        </button>
        <AddPost farcasterUserData={farcasterUserData} />
      </SidebarWrapper>
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  gap: 20px;
`
const MainWrapper = styled.div`
  height: 100%;
  width: 0;
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const SidebarWrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
