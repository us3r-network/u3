import styled from 'styled-components'
import SearchInput from '../components/common/input/SearchInput'
import { useCallback, useEffect, useState } from 'react'
import InputBase from '../components/common/input/InputBase'
import { ButtonPrimaryLine } from '../components/common/button/ButtonBase'
import { useLensAuth } from '../contexts/AppLensCtx'
import {
  PublicationTypes,
  useExplorePublications,
} from '@lens-protocol/react-web'
import axios from 'axios'
import { API_BASE_URL } from '../constants'
import { Profile, SignInWithLens } from '@lens-protocol/widgets-react'

const getTrendingPosts = async () => {
  return await axios.get(API_BASE_URL + '/posts')
}
export default function SocialLens() {
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const res = useExplorePublications({
    publicationTypes: [PublicationTypes.Post],
    limit: 25,
  })
  console.log({ res })

  const loadTrendingPosts = useCallback(() => {
    setLoading(true)
    getTrendingPosts()
      .then((res) => {
        console.log({ res })
      })
      .catch((error) => {
        console.log(error)
      })
    setLoading(false)
  }, [])

  const loadFollowingPosts = useCallback(() => {
    setLoading(true)
    setPosts([])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadTrendingPosts()
  }, [loadTrendingPosts])

  const onSignIn = async (tokens: any, profile: any) => {
    console.log('tokens: ', tokens)
    console.log('profile: ', profile)
  }

  const { isLogin, lensLogout } = useLensAuth()
  // if (!isLogin) {
  //   return <NoLoginLens />
  // }
  return (
    <SocialLensWrapper>
      <MainWrapper>
        <MainHeader>
          <SignInWithLens onSignIn={onSignIn} />
          <Profile />
          <button
            onClick={() => {
              loadTrendingPosts()
            }}
          >
            Trending
          </button>
          <button
            onClick={() => {
              loadFollowingPosts()
            }}
          >
            Following
          </button>
          <button
            onClick={() => {
              lensLogout()
            }}
          >
            Logout Lens
          </button>
        </MainHeader>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <PostList>
            {posts.map((post) => (
              <div key={post?.id}>{post?.content}</div>
            ))}
          </PostList>
        )}
      </MainWrapper>
      <SidebarWrapper>
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

function NoLoginLens() {
  const { isLogin, isLoginPending, lensLogin } = useLensAuth()
  return (
    <NoLoginLensWrapper>
      {(() => {
        if (isLoginPending) return <div>Loading...</div>
        if (!isLogin) {
          return (
            <button
              onClick={() => {
                lensLogin()
              }}
            >
              Login Lens
            </button>
          )
        }
        return <div>Logined</div>
      })()}
    </NoLoginLensWrapper>
  )
}
const NoLoginLensWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
`

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
