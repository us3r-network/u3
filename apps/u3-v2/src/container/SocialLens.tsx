import styled from 'styled-components'
import SearchInput from '../components/common/input/SearchInput'
import { useCallback, useEffect, useState } from 'react'
import InputBase from '../components/common/input/InputBase'
import { ButtonPrimaryLine } from '../components/common/button/ButtonBase'
import { useLensAuth } from '../contexts/AppLensCtx'
import LensPostCard from '../components/lens/LensPostCard'
import { useLoadLensFeeds } from '../hooks/lens/useLoadLensFeeds'

export default function SocialLens() {
  const { isLogin, isLoginPending, lensLogin, lensLogout } = useLensAuth()
  const [search, setSearch] = useState('')

  const {
    firstLoading,
    moreLoading,
    feeds,
    loadFirstLensFeeds,
    loadMoreLensFeeds,
    pageInfo,
  } = useLoadLensFeeds()

  useEffect(() => {
    loadFirstLensFeeds()
  }, [loadFirstLensFeeds])

  const lensLikeAction = useCallback(async (publicationId: string) => {}, [])

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

        <div>
          {!firstLoading && !moreLoading && pageInfo.hasNextPage && (
            <button
              onClick={() => {
                loadMoreLensFeeds()
              }}
            >
              Load More
            </button>
          )}
        </div>
      </MainWrapper>
      <SidebarWrapper>
        <MainHeader>
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
        </MainHeader>
        <PostSearch onSearch={setSearch} defaultValue={search} />
        <PublishPost />
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
  width: 0;
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`
const MainHeader = styled.div`
  display: flex;
  gap: 10px;
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
const PostSearch = styled(SearchInput)``

function PublishPost() {
  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = useCallback(() => {
    setLoading(true)
    setPost('')
    setLoading(false)
  }, [])
  return (
    <PublishPostWrapper>
      <PublishPostHeader>Publish Post</PublishPostHeader>
      <PublishPostForm>
        <PublishPostInput
          disabled={loading}
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <PublishPostButton disabled={loading} onClick={handleSubmit}>
          + Post
        </PublishPostButton>
      </PublishPostForm>
    </PublishPostWrapper>
  )
}
const PublishPostWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
`
const PublishPostHeader = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
`
const PublishPostForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const PublishPostInput = styled(InputBase)``
const PublishPostButton = styled(ButtonPrimaryLine)`
  width: 100%;
`

function LensNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  useEffect(() => {
    setNotifications([])
  }, [])
  return (
    <NotificationsWrapper>
      <NotificationsHeader>Notifications</NotificationsHeader>
      <NotificationList>
        {notifications.map((message) => (
          <NotificationItem key={message?.id}>
            {message?.content}
          </NotificationItem>
        ))}
      </NotificationList>
    </NotificationsWrapper>
  )
}

const NotificationsWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
`
const NotificationsHeader = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
`
const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #ccc;
`
const NotificationItem = styled.div`
  width: 100%;
  height: 40px;
`
