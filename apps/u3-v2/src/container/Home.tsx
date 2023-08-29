import styled from 'styled-components'
import { useEffect, useMemo } from 'react'
import LensPostCard from '../components/lens/LensPostCard'
import { useActiveProfile } from '@lens-protocol/react-web'
import FCast from '../components/FCast'
import { useLoadFeeds } from '../hooks/useLoadFeeds'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import { useSearchParams } from 'react-router-dom'

export default function Home() {
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile()

  const {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  } = useLoadFeeds()

  const { openFarcasterQR, farcasterUserData } = useFarcasterCtx()

  const [searchParams] = useSearchParams()
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams],
  )

  useEffect(() => {
    if (activeLensProfileLoading) return
    loadFirstFeeds({
      activeLensProfileId: activeLensProfile?.id,
      keyword: currentSearchParams.keyword,
    })
  }, [
    loadFirstFeeds,
    activeLensProfileLoading,
    activeLensProfile?.id,
    currentSearchParams.keyword,
  ])

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
                  keyword: currentSearchParams.keyword,
                  activeLensProfileId: activeLensProfile?.id,
                })
              }}
            >
              Load More
            </button>
          )}
        </p>
      </MainWrapper>
      <SidebarWrapper>Comming soon</SidebarWrapper>
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  gap: 40px;
`
const MainWrapper = styled.div`
  width: 750px;
`
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const SidebarWrapper = styled.div`
  width: 0;
  flex: 1;
  height: 344px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #212228;

  display: flex;
  justify-content: center;
  align-items: center;
`
