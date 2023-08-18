import styled from 'styled-components'
import { useEffect } from 'react'
import { useLensAuth } from '../contexts/AppLensCtx'
import LensPostCard from '../components/lens/LensPostCard'
import { useLoadLensFeeds } from '../hooks/lens/useLoadLensFeeds'
import LensPostCreate from '../components/lens/LensPostCreate'
import LensNotifications from '../components/lens/LensNotifications'

export default function SocialLens() {
  const { isLogin, isLoginPending, lensLogin, lensLogout } = useLensAuth()

  const {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstLensFeeds,
    loadMoreLensFeeds,
  } = useLoadLensFeeds()

  useEffect(() => {
    loadFirstLensFeeds()
  }, [loadFirstLensFeeds])

  return (
    <SocialLensWrapper>
      <MainWrapper>
        {firstLoading ? (
          <div>Loading...</div>
        ) : (
          <PostList>
            {feeds.map(({ platform, data }) => {
              if (platform === 'lens') {
                return <LensPostCard key={data.id} data={data} />
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
                loadMoreLensFeeds()
              }}
            >
              Load More
            </button>
          )}
        </p>
      </MainWrapper>
      <SidebarWrapper>
        <button
          onClick={() => {
            if (isLogin) {
              lensLogout()
            } else {
              lensLogin()
            }
          }}
        >
          {(() => {
            if (isLoginPending) return 'Loading...'
            if (isLogin) return 'Logout Lens'
            return 'Login Lens'
          })()}
        </button>
        <button
          onClick={() => {
            loadFirstLensFeeds()
          }}
        >
          Refresh the list
        </button>
        <LensPostCreate />
        <LensNotifications />
      </SidebarWrapper>
    </SocialLensWrapper>
  )
}

const SocialLensWrapper = styled.div`
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
