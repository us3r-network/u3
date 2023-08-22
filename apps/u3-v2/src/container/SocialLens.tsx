import styled from 'styled-components'
import { useEffect } from 'react'
import { useLensAuth } from '../contexts/AppLensCtx'
import LensPostCard from '../components/lens/LensPostCard'
import { useLoadLensFeeds } from '../hooks/lens/useLoadLensFeeds'
import LensNotifications from '../components/lens/LensNotifications'
import { useGlobalModal } from '../contexts/GlobalModalCtx'

export default function SocialLens() {
  const { isLogin } = useLensAuth()

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

  const { setOpenLensLoginModal, setOpenLensCreatePostModal } = useGlobalModal()

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
            loadFirstLensFeeds()
          }}
        >
          Refresh the list
        </button>
        <button
          onClick={() => {
            if (!isLogin) {
              setOpenLensLoginModal(true)
              return
            }
            setOpenLensCreatePostModal(true)
          }}
        >
          + Create Post
        </button>
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
