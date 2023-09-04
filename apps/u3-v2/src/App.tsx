import { Outlet, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import { ProfileStateProvider } from '@us3r-network/profile'

import { XmtpClientProvider } from './contexts/xmtp/XmtpClientCtx'
import { XmtpStoreProvider } from './contexts/xmtp/XmtpStoreCtx'
import FarcasterProvider from './contexts/FarcasterCtx'

import Home from './container/Home'
import Profile from './container/Profile'
import NoMatch from './container/NoMatch'
import { CERAMIC_HOST, WALLET_CONNECT_PROJECT_ID } from './constants'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Nav from './components/Nav'
import { AppLensProvider } from './contexts/AppLensCtx'
import Modal from 'react-modal'
import PostDetail from './container/PostDetail'
import LensPostDetail from './container/LensPostDetail'

dayjs.extend(relativeTime)

Modal.setAppElement('#root')

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="post-detail/lens/:publicationId"
          element={<LensPostDetail />}
        />
        <Route path="post-detail/:castId" element={<PostDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Us3rAuthWithRainbowkitProvider
      projectId={WALLET_CONNECT_PROJECT_ID}
      appName="S3 Console"
    >
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
        <XmtpClientProvider>
          <XmtpStoreProvider>
            <AppLensProvider>
              <FarcasterProvider>
                <Routers />
              </FarcasterProvider>
            </AppLensProvider>
          </XmtpStoreProvider>
        </XmtpClientProvider>
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  )
}

function Layout() {
  return (
    <LayoutWrapper>
      <Nav />
      <AppContainer className="container">
        <Outlet />
      </AppContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </LayoutWrapper>
  )
}
const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #191a1f;
  overflow-y: auto;
`

const AppContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
  margin-top: calc(80px + 40px);
  margin-bottom: 40px;
`
